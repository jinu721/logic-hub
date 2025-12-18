import { PublicUserDTO } from "@modules/user/dtos";
import { CreateUserInput, HttpContext, SocialLoginInput, AuthContext, UserDocument } from "@shared/types";
import { Response } from "express";

export interface IAuthService {
  register(dto: CreateUserInput): Promise<{ email: string }>;

  resendOtp(email: string): Promise<{ email: string }>;

  verifyOTP(
    dto: { email: string; otp: string },
    ctx: HttpContext
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  login(
    dto: { identifier: string; password: string },
    ctx: HttpContext
  ): Promise<{
    isVerified: boolean;
    security: boolean;
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  verifyLogin(
    token: string,
    ctx: HttpContext
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  refreshAccessToken(
    refreshTokenCookie: string | undefined,
    ctx: HttpContext
  ): Promise<{ accessToken: string }>;

  socialLogin(
    data: SocialLoginInput
  ): Promise<UserDocument>;

  socialAuthCallback(
    oauthUser: UserDocument,
    ctx: HttpContext
  ): Promise<string>;

  forgotPassword(email: string): Promise<{ message: string }>;

  resetPasswordWithLinkToken(
    token: string,
    newPassword: string
  ): Promise<{ message: string }>;

  changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;

  logout(
    userId: string,
    bearerToken: string,
    ctx: AuthContext
  ): Promise<{ message: string }>;

  getMe(userId: string): Promise<{ role: string; isBanned: boolean }>;


  clearCookies(res: Response): Promise<{ message: string }>;
}
