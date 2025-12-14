import { Request, Response } from "express"
import { HttpStatus } from "@constants"
import { IAuthController } from "@modules/user"
import { IAuthService } from "@modules/user"
import { asyncHandler, sendSuccess, AppError } from "@utils/application"


import { RegisterRequestDto, LoginRequestDto, VerifyOtpRequestDto, ResetPasswordRequestDto, ChangePasswordRequestDto, LogoutRequestDto, VerifyLoginDto, RefreshTokenDto, ForgotPasswordDto } from "@modules/user/dtos";
import { UserDocument } from "@shared/types"

export class AuthController implements IAuthController {
  constructor(private readonly authSvc: IAuthService) { }

  register = asyncHandler(async (req: Request, res: Response) => {
    const dto = RegisterRequestDto.from(req.body);

    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(400, validation.errors?.join(", "));
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
    const dto = VerifyOtpRequestDto.from(req.body);
    const validation = dto.validate();

    if (!validation.valid) {
      throw new AppError(400, validation.errors?.join(", "));
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
    const dto = LoginRequestDto.from(req.body as Partial<LoginRequestDto>);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", ") || "Validation failed");
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
    const dto = VerifyLoginDto.from({ token: req.query.token as string });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const result = await this.authSvc.verifyLogin(dto.token, ctx);
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Login verified successfully"
    );
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const dto = RefreshTokenDto.from({ refreshToken: req.cookies?.refreshToken });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.UNAUTHORIZED, validation.errors?.join(", "));
    }

    const ctx = { res };
    const result = await this.authSvc.refreshAccessToken(
      dto.refreshToken,
      ctx
    );
    return sendSuccess(
      res,
      HttpStatus.OK,
      result,
      "Token refreshed successfully"
    );
  });

  googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const url = await this.authSvc.socialAuthCallback(req.user as unknown as UserDocument, ctx);
    return res.redirect(url);
  });

  githubAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Authentication failed!");
    }
    const ctx = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      res,
    };
    const url = await this.authSvc.socialAuthCallback(req.user as unknown as UserDocument, ctx);
    return res.redirect(url);
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto = ForgotPasswordDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this.authSvc.forgotPassword(dto.email);
    return sendSuccess(res, HttpStatus.OK, result);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto = ResetPasswordRequestDto.from({
      token: req.query.token as string,
      password: req.body.password as string,
    });

    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(400, validation.errors?.join(", "));
    }

    const result = await this.authSvc.resetPasswordWithLinkToken(
      dto.token,
      dto.password
    );
    return sendSuccess(res, HttpStatus.OK, result);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const dto = ChangePasswordRequestDto.from(req.body);

    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(400, validation.errors?.join(", "));
    }
    const result = await this.authSvc.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword
    );
    return sendSuccess(res, HttpStatus.OK, result);
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const me = await this.authSvc.getMe(userId);
    return sendSuccess(res, HttpStatus.OK, me);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const bearer = req.headers["authorization"];

    const dto = LogoutRequestDto.from({
      userId,
      token: bearer?.split(" ")[1]
    });

    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(401, validation.errors?.join(", "));
    }

    const ctx = { res };
    const result = await this.authSvc.logout(dto.userId, dto.token, ctx);
    return sendSuccess(res, HttpStatus.OK, result);
  });

  clearCookies = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.authSvc.clearCookies(res);
    return sendSuccess(res, HttpStatus.OK, result);
  });
}
