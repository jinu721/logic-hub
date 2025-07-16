import { Request, Response } from "express";
import { UserService } from "../../services/implements/user.service";
import { HttpStatus } from "../../constants/http.status";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generate.token";
import { setAccessToken, setRefreshToken } from "../../utils/set.cookies";
import { IAuthController } from "../interfaces/auth.controller.interface";
import { env } from "../../config/env";
import { verifyLinkToken, verifyRefreshToken } from "../../utils/verify.token";
import redisClient from "../../config/redis.config";
import jwt from "jsonwebtoken";
import { TokenService } from "../../services/implements/token.service";

export class AuthController implements IAuthController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = await this.userService.register(
        req.body.username,
        req.body.email,
        req.body.password
      );
      res
        .status(HttpStatus.CREATED)
        .json({ email: userData.email, message: "OTP Sent Successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Something Went Wrong",
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const userData = await this.userService.verifyOTP(
        req.body.email,
        req.body.otp
      );
      if (!userData) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid OTP" });
        return;
      }

      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);
      await this.tokenService.createToken({
        userId: userData._id,
        accessToken,
        refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      res.status(HttpStatus.OK).json({ userData, accessToken, refreshToken });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error ? error.message : "Something Went Wrong",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result: any = await this.userService.login(
        req.body.email,
        req.body.password
      );

      if (result.isBanned) {
        res.status(HttpStatus.OK).json({
          isBanned: true,
          message: result.message,
        });
        return;
      }

      if (!result.isVerified) {
        res.status(HttpStatus.OK).json({
          isVerified: false,
          email: result.email,
          security: true,
          message: result.message,
        });
        return;
      }

      if (result.security) {
        res
          .status(HttpStatus.OK)
          .json({ isVerified: true, security: true, message: result.message });
        return;
      }

      console.log("User OK");

      console.log(`Access Token: ${result.accessToken}`);
      console.log(`Refresh Token: ${result.refreshToken}`);

      setAccessToken(res, result.accessToken);
      setRefreshToken(res, result.refreshToken);

      console.log("Cookie Setted")

      await this.tokenService.createToken({
        userId: result.userId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      res.status(HttpStatus.OK).json({
        isVerified: true,
        security: false,
        message: "Login Completed Successfully",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  }

  async verifyLogin(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.verifyLogin(
        req.query.token as string
      );

      setAccessToken(res, result.accessToken);
      setRefreshToken(res, result.refreshToken);

      await this.tokenService.createToken({
        userId: result.userId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      res.status(HttpStatus.OK).json({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: error instanceof Error ? error.message : "Invalid token",
      });
    }
  }

  refreshToken(req: Request, res: Response): void {
    try {
      const refreshToken = req.cookies.refreshToken;

      console.log("COOKIES: ", req.cookies);

      console.log("Refresh Token: ", refreshToken);

      if (!refreshToken) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Refresh token not found. Please log in again." });
        return;
      }

      const user = verifyRefreshToken(refreshToken);

      if (!user) {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Invalid refresh token. Please log in again." });
        return;
      }

      console.log("VERIFIED USER: ", user);

      const newAccessToken = generateAccessToken(user as any);

      setAccessToken(res, newAccessToken);

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Authentication failed!" });
      return;
    }

    const user = req.user as any;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await this.tokenService.createToken({
      userId: user._id,
      accessToken,
      refreshToken,
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers["user-agent"] || "unknown",
    });

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 15,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 15,
    });

    res.redirect(`${process.env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`);
  }

  async githubAuth(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Authentication failed!" });
      return;
    }

    const user = req.user as any;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("User", user);

    await this.tokenService.createToken({
      userId: user._id,
      accessToken,
      refreshToken,
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers["user-agent"] || "unknown",
    });

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.redirect(`${process.env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const forgotData = await this.userService.forgotPassword(req.body.email);
      res.status(HttpStatus.OK).json({ message: forgotData.message });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          err instanceof Error ? err.message : "Failed to Forgot Password",
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {

      const password = req.body.password;
      if (!password) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Password is required" });
        return;
      }

      const token = req.query.token as string;
      const user = await verifyLinkToken(token);

      if(!user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const userId = user.userId;


      await this.userService.resetPassword(userId, password);

      res.status(HttpStatus.OK).json({
        message: "Forgot Password Completed",
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          err instanceof Error ? err.message : "Failed to Forgot Password",
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      await this.userService.changePassword(
        userId,
        req.body.oldPassword,
        req.body.newPassword
      );
      res
        .status(HttpStatus.OK)
        .json({ message: "Your password has been changed" });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          err instanceof Error ? err.message : "Failed to Change Password",
      });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.userService.findUserById(userId);

      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
        return;
      }

      res.status(HttpStatus.OK).json({
        role: user.role,
        isBanned: user.isBanned,
      });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token) {
        const decoded = jwt.decode(token) as jwt.JwtPayload;

        if (decoded && decoded.exp) {
          const expiry = decoded.exp - Math.floor(Date.now() / 1000);
          redisClient.setEx(`blacklist_${token}`, expiry, "true");
        }
      }

      await this.tokenService.deleteTokenByUserId((req as any).user?.userId);

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
        path: "/",
      });

      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  }

  clearCookies(req: Request, res: Response): void {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
      path: "/",
    });
  }
}
