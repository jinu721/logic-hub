import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token/generate.token";
import { setAccessToken, setRefreshToken } from "../../utils/token/set.cookies";
import { IAuthController } from "./auth.controller.interface";
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
import { clearAuthCookies } from "../../utils/token/clear.cookies";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

export class AuthController implements IAuthController {
  constructor(
    private readonly _userSvc: IUserService,
    private readonly _tokenSvc: ITokenService
  ) {}

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Username, Email and Password are required");
    }
    const userData = await this._userSvc.register(username, email, password);
    sendSuccess(res, HttpStatus.CREATED, { email: userData.email }, "OTP Sent Successfully");
  });

  verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Email and OTP are required");
    }
    const { accessToken, refreshToken, userData } = await this._userSvc.verifyOTP(email, otp);

    await this._tokenSvc.createToken({
      userId: userData._id,
      accessToken,
      refreshToken,
      ip: req.ip || req.connection.remoteAddress,
      device: req.headers["user-agent"] || "unknown",
    });

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    sendSuccess(res, HttpStatus.OK, { accessToken }, "Account Verified Successfully");
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { emailOrUsername, password } = req.body;
    const result: any = await this._userSvc.login(emailOrUsername, password);

    if (result.isBanned) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Your account has been banned");
    }


    if (result.security) {
      sendSuccess(res, HttpStatus.OK, { isVerified: true, security: true }, result.message);
      return;
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

    sendSuccess(
      res,
      HttpStatus.OK,
      { isVerified: true, security: false, accessToken: result.accessToken },
      "Login Completed Successfully"
    );
  });

  verifyLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      throw new AppError(HttpStatus.BAD_REQUEST, "Token is required");
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

    sendSuccess(res, HttpStatus.OK, { accessToken: result.accessToken }, "Login Verified Successfully");
  });

  refreshToken(req: Request, res: Response): void {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        sendError(res, HttpStatus.FORBIDDEN, "Refresh token not found. Please log in again.");
        return;
      }

      const user = verifyRefreshToken(refreshToken);

      if (!user) {
        sendError(res, HttpStatus.FORBIDDEN, "Invalid refresh token. Please log in again.");
        return;
      }

      const newAccessToken = generateAccessToken(user as any);
      setAccessToken(res, newAccessToken);

      sendSuccess(res, HttpStatus.OK, { accessToken: newAccessToken }, "Token refreshed successfully");
    } catch (err) {
      logger.error(`Failed to refresh token ${req.method} ${req.url}`, { error: err });
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
    }
  }

  googleAuth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
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

    res.redirect(`${env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`);
  });

  githubAuth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
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

    res.redirect(`${env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;
    if (!email) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Email is required");
    }
    const forgotData = await this._userSvc.forgotPassword(email);
    sendSuccess(res, HttpStatus.OK, { message: forgotData.message });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const password = req.body.password;
    const token = req.query.token as string;
    if (!password || !token) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Password and token are required");
    }

    const user = await verifyLinkToken(token);
    if (!user) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid token");
    }

    const userId = user.userId;
    await this._userSvc.resetPassword(userId, password);

    sendSuccess(res, HttpStatus.OK, { message: "Password reset successfully" });
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    await this._userSvc.changePassword(userId, req.body.oldPassword, req.body.newPassword);
    sendSuccess(res, HttpStatus.OK, { message: "Your password has been changed" });
  });

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const user = await this._userSvc.findUserById(userId);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    }

    sendSuccess(res, HttpStatus.OK, { role: user.role, isBanned: user.isBanned });
  });

  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (decoded && decoded.exp) {
      const expiry = decoded.exp - Math.floor(Date.now() / 1000);
      RedisHelper.set(`blacklist_${token}`, "true", expiry);
    }

    await this._tokenSvc.deleteTokenByUserId((req as any).user?.userId);
    clearAuthCookies(res);

    sendSuccess(res, HttpStatus.OK, { message: "Logged out successfully" });
  });

  clearCookies(req: Request, res: Response): void {
    try {
      clearAuthCookies(res);
      sendSuccess(res, HttpStatus.OK, { message: "Cookies cleared successfully" });
    } catch (error) {
      logger.error(`Failed to clear cookies ${req.method} ${req.url}`, { error });
      sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
}
