import { Request, Response } from "express"
import { HttpStatus } from "@constants"
import { IAuthController } from "@modules/user"
import { IAuthService } from "@modules/user"
import { asyncHandler, sendSuccess, AppError } from "@utils/application"
import { CreateUserDTO, LoginDTO, VerifyOtpDTO } from "@modules/user"


export class AuthController implements IAuthController {
  constructor(private readonly authSvc: IAuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const dto: CreateUserDTO = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    if (!dto.username || !dto.email || !dto.password) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Username, Email and Password are required"
      );
    }
    const result = await this.authSvc.register(dto);
    return sendSuccess(
      res,
      HttpStatus.CREATED,
      result,
      "OTP sent successfully"
    );
  });

  verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const dto: VerifyOtpDTO = {
      email: req.body.email,
      otp: req.body.otp,
    };
    if (!dto.email || !dto.otp) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Email and OTP are required");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const result = await this.authSvc.verifyOTP(dto, ctx);
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Account verified successfully"
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const dto: LoginDTO = {
      identifier: req.body.emailOrUsername || req.body.email,
      password: req.body.password,
    };
    if (!dto.identifier || !dto.password) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Identifier and password are required"
      );
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const result = await this.authSvc.login(dto, ctx);
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Login completed successfully"
    );
  });

  verifyLogin = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string | undefined;
    if (!token) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Token is required");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const result = await this.authSvc.verifyLogin(token, ctx);
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Login verified successfully"
    );
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken as
      | string
      | undefined;
    const ctx = { res };
    const result = await this.authSvc.refreshAccessToken(
      refreshTokenFromCookie,
      ctx
    );
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Token refreshed successfully"
    );
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const url = await this.authSvc.socialAuth(req.user as any, ctx); 
    return res.redirect(url);
  });

  githubAuth = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const url = await this.authSvc.socialAuth(req.user as any, ctx);
    return res.redirect(url);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };
    if (!email) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Email is required");
    }
    const result = await this.authSvc.forgotPassword(email);
    return sendSuccess(res, HttpStatus.OK, result);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string | undefined;
    const { password } = req.body as { password?: string };
    if (!token || !password) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Password and token are required"
      );
    }
    const result = await this.authSvc.resetPasswordWithLinkToken(
      token,
      password
    );
    return sendSuccess(res, HttpStatus.OK, result);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    const { oldPassword, newPassword } = req.body as {
      oldPassword?: string;
      newPassword?: string;
    };
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const result = await this.authSvc.changePassword(
      userId,
      oldPassword!,
      newPassword!
    );
    return sendSuccess(res, HttpStatus.OK, result);
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const me = await this.authSvc.getMe(userId);
    return sendSuccess(res, HttpStatus.OK, me);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId as string | undefined;
    const bearer = req.headers["authorization"];
    if (!userId || !bearer)
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const token = bearer.split(" ")[1];
    const ctx = { res };
    const result = await this.authSvc.logout(userId, token, ctx);
    return sendSuccess(res, HttpStatus.OK, result);
  });

  clearCookies = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.authSvc.clearCookies(res);
    return sendSuccess(res, HttpStatus.OK, result);
  });
}
