import { PublicUserDTO } from "@modules/user/dtos";

export interface IAuthService {
  register(dto: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ email: string }>;

  resendOtp(email: string): Promise<{ email: string }>;

  verifyOTP(
    dto: { email: string; otp: string },
    ctx: { ip?: string | null; userAgent?: string; res?: any }
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  login(
    dto: { identifier: string; password: string },
    ctx: { ip?: string | null; userAgent?: string; res?: any }
  ): Promise<{
    isVerified: boolean;
    security: boolean;
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  verifyLogin(
    token: string,
    ctx: { ip?: string | null; userAgent?: string; res?: any }
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: PublicUserDTO;
  }>;

  refreshAccessToken(
    refreshTokenCookie: string | undefined,
    ctx: { ip?: string | null; userAgent?: string; res?: any }
  ): Promise<{ accessToken: string }>;

  socialAuth(
    oauthUser: any,
    ctx: { ip?: string | null; userAgent?: string; res?: any }
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
    ctx: { res?: any }
  ): Promise<{ message: string }>;

  getMe(userId: string): Promise<{ role: string; isBanned: boolean }>;


  clearCookies(res: any): Promise<{ message: string }>;
}
