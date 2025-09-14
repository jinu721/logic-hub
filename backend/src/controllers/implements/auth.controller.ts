import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token/generate.token";
import { setAccessToken, setRefreshToken } from "../../utils/token/set.cookies";
import { IAuthController } from "../interfaces/auth.controller.interface";
import { env } from "../../config/env";
import {
  verifyLinkToken,
  verifyRefreshToken,
} from "../../utils/token/verify.token";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "../../utils/application/response.util";
import { IUserService } from "../../services/interfaces/user.services.interface";
import { ITokenService } from "../../services/interfaces/token.service.interface";
import { RedisHelper } from "../../utils/database/redis.util";
import logger from "../../utils/application/logger";

export class AuthController implements IAuthController {
  constructor(
    private readonly _userSvc: IUserService,
    private readonly _tokenSvc: ITokenService
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST,
          "All fields are required"
        );
      }
      const userData = await this._userSvc.register(username, email, password);
      return sendSuccess(
        res,
        HttpStatus.CREATED,
        { email: userData.email },
        "OTP Sent Successfully"
      );
    } catch (error) {
      logger.error(`Failed to register user ${req.method} ${req.url}`, {
        error,
      });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST,
          "Email and OTP are required"
        );
      }
      const userData = await this._userSvc.verifyOTP(email, otp);
      if (!userData) {
        return sendError(res, HttpStatus.BAD_REQUEST, "Invalid OTP");
      }

      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);
      await this._tokenSvc.createToken({
        userId: userData._id,
        accessToken,
        refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      return sendSuccess(
        res,
        HttpStatus.OK,
        { accessToken, refreshToken },
        "Account Verified Successfully"
      );
    } catch (error) {
      logger.error(`Failed to verify OTP ${req.method} ${req.url}`, { error });
      return sendError(res, HttpStatus.BAD_REQUEST, error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { emailOrUsername, password } = req.body;
      const result: any = await this._userSvc.login(emailOrUsername, password);

      if (result.isBanned) {
        return sendError(res, HttpStatus.FORBIDDEN, result.message, {
          isBanned: true,
        });
      }

      if (!result.isVerified) {
        return sendSuccess(
          res,
          HttpStatus.OK,
          { email: result.email, security: true },
          result.message
        );
      }

      if (result.security) {
        return sendSuccess(
          res,
          HttpStatus.OK,
          { isVerified: true, security: true },
          result.message
        );
      }

      setAccessToken(res, result.accessToken);
      setRefreshToken(res, result.refreshToken);

      await this._tokenSvc.createToken({
        userId: result.userId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      return sendSuccess(
        res,
        HttpStatus.OK,
        {
          isVerified: true,
          security: false,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        "Login Completed Successfully"
      );
    } catch (error) {
      logger.error(`Failed to login user ${req.method} ${req.url}`, { error });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async verifyLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return sendError(res, HttpStatus.BAD_REQUEST, "Invalid token");
      }
      const result = await this._userSvc.verifyLogin(token as string);

      setAccessToken(res, result.accessToken);
      setRefreshToken(res, result.refreshToken);

      await this._tokenSvc.createToken({
        userId: result.userId,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      return sendSuccess(
        res,
        HttpStatus.OK,
        { accessToken: result.accessToken, refreshToken: result.refreshToken },
        "Login Verified Successfully"
      );
    } catch (error) {
      logger.error(`Failed to verify login ${req.method} ${req.url}`, {
        error,
      });
      return sendError(res, HttpStatus.UNAUTHORIZED, error);
    }
  }

  refreshToken(req: Request, res: Response): Response {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return sendError(
          res,
          HttpStatus.FORBIDDEN,
          "Refresh token not found. Please log in again."
        );
      }

      const user = verifyRefreshToken(refreshToken);

      if (!user) {
        return sendError(
          res,
          HttpStatus.FORBIDDEN,
          "Invalid refresh token. Please log in again."
        );
      }

      const newAccessToken = generateAccessToken(user as any);

      setAccessToken(res, newAccessToken);

      return sendSuccess(
        res,
        HttpStatus.OK,
        { accessToken: newAccessToken },
        "Token refreshed successfully"
      );
    } catch (err) {
      logger.error(`Failed to refresh token ${req.method} ${req.url}`, {
        error: err,
      });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Authentication failed!");
        return;
      }

      const user = req.user as any;
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await this._tokenSvc.createToken({
        userId: user._id,
        accessToken,
        refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      res.redirect(
        `${env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`
      );
    } catch (error) {
      logger.error(
        `Failed to authenticate with Google ${req.method} ${req.url}`,
        { error }
      );
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async githubAuth(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, HttpStatus.UNAUTHORIZED, "Authentication failed!");
        return;
      }

      const user = req.user as any;
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await this._tokenSvc.createToken({
        userId: user._id,
        accessToken,
        refreshToken,
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers["user-agent"] || "unknown",
      });

      setAccessToken(res, accessToken);
      setRefreshToken(res, refreshToken);

      res.redirect(
        `${env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`
      );
    } catch (error) {
      logger.error(
        `Failed to authenticate with GitHub ${req.method} ${req.url}`,
        { error }
      );
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.body.email;
      const forgotData = await this._userSvc.forgotPassword(email);
      return sendSuccess(res, HttpStatus.OK, { message: forgotData.message });
    } catch (error) {
      logger.error(
        `Failed to process forgot password ${req.method} ${req.url}`,
        { error }
      );
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const password = req.body.password;
      const token = req.query.token as string;
      if (!password || !token) {
        return sendError(
          res,
          HttpStatus.BAD_REQUEST,
          "Password and token are required"
        );
      }

      const user = await verifyLinkToken(token);

      if (!user) {
        return sendError(res, HttpStatus.UNAUTHORIZED, "Invalid token");
      }

      const userId = user.userId;

      await this._userSvc.resetPassword(userId, password);

      return sendSuccess(res, HttpStatus.OK, {
        message: "Password reset successfully",
      });
    } catch (error) {
      logger.error(`Failed to reset password ${req.method} ${req.url}`, {
        error,
      });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
      }

      await this._userSvc.changePassword(
        userId,
        req.body.oldPassword,
        req.body.newPassword
      );
      return sendSuccess(res, HttpStatus.OK, {
        message: "Your password has been changed",
      });
    } catch (error) {
      logger.error(`Failed to change password ${req.method} ${req.url}`, {
        error,
      });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async getMe(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
      }

      const user = await this._userSvc.findUserById(userId);

      if (!user) {
        return sendError(res, HttpStatus.NOT_FOUND, "User not found");
      }

      return sendSuccess(res, HttpStatus.OK, {
        role: user.role,
        isBanned: user.isBanned,
      });
    } catch (error) {
      logger.error(`Failed to get user ${req.method} ${req.url}`, {
        error,
      });
      return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Error Getting User");
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
      }
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return sendError(res, HttpStatus.UNAUTHORIZED, "Unauthorized");
      }

      const decoded = jwt.decode(token) as jwt.JwtPayload;

      if (decoded && decoded.exp) {
        const expiry = decoded.exp - Math.floor(Date.now() / 1000);
        RedisHelper.set(`blacklist_${token}`, "true", expiry);
      }

      await this._tokenSvc.deleteTokenByUserId((req as any).user?.userId);

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

      sendSuccess(res, HttpStatus.OK, { message: "Logged out successfully" });
    } catch (err) {
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
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
