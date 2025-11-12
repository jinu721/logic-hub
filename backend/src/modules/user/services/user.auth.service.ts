import jwt from "jsonwebtoken"

import { BaseService } from "@core"
import { AppError, generateOTP, toObjectId } from "@utils/application"
import { HttpStatus } from "@constants"
import { IAuthService, IUserRepository, IPendingUserRepository, PublicUserDTO, CreateUserDTO, VerifyOtpDTO, toPublicUserDTO, toPublicUserDTOs } from "@modules/user"
import { ITokenProvider } from "@providers/token"
import { IEmailProvider } from "@providers/email"
import { IHashProvider } from "@providers/hashing"
import { ITokenService } from "@modules/token"
import { UserIF } from "@shared/types"
import { env } from "@config/env"
import { setAccessToken, setRefreshToken, clearAuthCookies, verifyLinkToken } from "@utils/token"
import { RedisHelper } from "@utils/database"


type HttpContext = { ip?: string | null | undefined; userAgent?: string | undefined; res?: any };

export class AuthService extends BaseService<UserIF, PublicUserDTO> implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly pendingRepo: IPendingUserRepository,
    private readonly tokenProv: ITokenProvider,
    private readonly emailProv: IEmailProvider,
    private readonly hashProv: IHashProvider,
    private readonly tokenSvc: ITokenService, 
  ) {
    super();
  }

  protected toDTO(user: UserIF): PublicUserDTO { return toPublicUserDTO(user); }
  protected toDTOs(users: UserIF[]): PublicUserDTO[] { return toPublicUserDTOs(users); }

  async register(dto: CreateUserDTO) {
    const exists =
      (await this.userRepo.getByEmailOrUsername(dto.username)) ||
      (await this.userRepo.getByEmailOrUsername(dto.email));
    if (exists) throw new AppError(HttpStatus.CONFLICT, "User already exists");

    const hashed = await this.hashProv.hashPassword(dto.password);
    const otp = generateOTP();

    await this.pendingRepo.createPendingUser({ username: dto.username, email: dto.email, password: hashed, otp });
    await this.emailProv.sendOTP(dto.email, otp);

    return { email: dto.email };
  }

  async resendOtp(email: string) {
    const pending = await this.pendingRepo.findPendingUserByEmail(email);
    if (!pending) throw new AppError(HttpStatus.NOT_FOUND, "User not found or already verified");
    const otp = generateOTP();
    await this.pendingRepo.updatePendingUserOtp(email, otp);
    await this.emailProv.sendOTP(email, otp);
    return { email };
  }

  async verifyOTP(dto: VerifyOtpDTO, ctx: HttpContext) {
    const pend = await this.pendingRepo.findPendingUserByEmail(dto.email);
    if (!pend) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    if (pend.otp !== Number(dto.otp)) throw new AppError(HttpStatus.UNAUTHORIZED, "Invalid OTP");

    await this.userRepo.createUser({ username: pend.username, email: dto.email, password: pend.password });
    const user = await this.userRepo.getByEmailOrUsername(dto.email);
    if (!user) throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "User create failed");

    await this.pendingRepo.deletePendingUser(dto.email);

    const pub = this.mapOne(user);
    const accessToken = this.tokenProv.generateAccessToken(pub);
    const refreshToken = this.tokenProv.generateRefreshToken(pub);

    await this.tokenSvc.createToken({
      userId: String(user._id),
      accessToken, refreshToken,
      ip: ctx.ip || undefined,
      device: ctx.userAgent || "unknown",
    });

    if (ctx.res) {
      setAccessToken(ctx.res, accessToken);
      setRefreshToken(ctx.res, refreshToken);
    }



    return { accessToken, refreshToken, user: pub };
  }

  async login(dto: { identifier: string; password: string }, ctx: HttpContext) {
    const user = await this.userRepo.getByEmailOrUsername(dto.identifier);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    if (user.loginType !== "normal") throw new AppError(HttpStatus.BAD_REQUEST, "Use OAuth login");
    if (user.isBanned) throw new AppError(HttpStatus.BAD_REQUEST, "Your account has been banned");

    const valid = await this.hashProv.comparePasswords(dto.password, user.password as string);
    if (!valid) throw new AppError(HttpStatus.UNAUTHORIZED, "Invalid credentials");

    const pub = this.mapOne(user);
    const accessToken = this.tokenProv.generateAccessToken(pub);
    const refreshToken = this.tokenProv.generateRefreshToken(pub);

    await this.tokenSvc.createToken({
      userId: String(user._id),
      accessToken, refreshToken,
      ip: ctx.ip || undefined,
      device: ctx.userAgent || "unknown",
    });

    if (ctx.res) {
      setAccessToken(ctx.res, accessToken);
      setRefreshToken(ctx.res, refreshToken);
    }

    return { isVerified: true, security: false, accessToken, refreshToken, user: pub };
  }

  async verifyLogin(token: string, ctx: HttpContext) {
    const decoded = this.tokenProv.verifyLinkToken(token);
    const user = await this.userRepo.getUserById(decoded.userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const pub = this.mapOne(user);
    const accessToken = this.tokenProv.generateAccessToken(pub);
    const refreshToken = this.tokenProv.generateRefreshToken(pub);

    await this.tokenSvc.createToken({
      userId: String(user._id),
      accessToken, refreshToken,
      ip: ctx.ip || undefined,
      device: ctx.userAgent || "unknown",
    });

    if (ctx.res) {
      setAccessToken(ctx.res, accessToken);
      setRefreshToken(ctx.res, refreshToken);
    }

    return { accessToken, refreshToken, user: pub };
  }

  async refreshAccessToken(refreshTokenCookie: string | undefined, ctx: HttpContext) {
    if (!refreshTokenCookie) {
      throw new AppError(HttpStatus.FORBIDDEN, "Refresh token not found. Please log in again.");
    }

    const decoded = this.tokenProv.verifyRefreshToken(refreshTokenCookie);
    if (!decoded?.userId) {
      throw new AppError(HttpStatus.FORBIDDEN, "Invalid refresh token. Please log in again.");
    }

    const user = await this.userRepo.getUserById(decoded.userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const pub = this.mapOne(user);
    const newAccessToken = this.tokenProv.generateAccessToken(pub);

    if (ctx.res) setAccessToken(ctx.res, newAccessToken);
    return { accessToken: newAccessToken };
  }

  async socialAuth(oauthUser: any, ctx: HttpContext) {
    const userId = String(oauthUser._id);
    const pub = {
      userId,
      email: oauthUser.email,
      username: oauthUser.username,
    } as unknown as PublicUserDTO;

    const accessToken = this.tokenProv.generateAccessToken(pub);
    const refreshToken = this.tokenProv.generateRefreshToken(pub);

    await this.tokenSvc.createToken({
      userId,
      accessToken, refreshToken,
      ip: ctx.ip || undefined,
      device: ctx.userAgent || "unknown",
    });

    if (ctx.res) {
      setAccessToken(ctx.res, accessToken);
      setRefreshToken(ctx.res, refreshToken);
    }

    return `${env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`;
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.getByEmailOrUsername(email);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "Email not found");

    const token = this.tokenProv.generateResetToken(this.mapOne(user));
    const link = `${env.FRONTEND_URL}/auth/reset?token=${token}`;
    await this.emailProv.sendLink(email, link);

    return { message: "Reset link sent" };
  }

  async resetPasswordWithLinkToken(linkToken: string, newPassword: string) {
    const payload = await verifyLinkToken(linkToken);
    if (!payload?.userId) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid token");

    const hashed = await this.hashProv.hashPassword(newPassword);
    await this.userRepo.updateUser(toObjectId(payload.userId), { password: hashed });

    return { message: "Password reset successfully" };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const ok = await this.hashProv.comparePasswords(oldPassword, user.password as string);
    if (!ok) throw new AppError(HttpStatus.UNAUTHORIZED, "Old password incorrect");

    const hashed = await this.hashProv.hashPassword(newPassword);
    await this.userRepo.updateUser(toObjectId(userId), { password: hashed });

    return { message: "Your password has been changed" };
  }

  async getMe(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return { role: (user as any).role, isBanned: (user as any).isBanned };
  }

  async logout(userId: string, bearerToken: string, ctx: HttpContext) {
    const decoded = jwt.decode(bearerToken) as jwt.JwtPayload | null;
    if (decoded?.exp) {
      const expiry = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiry > 0) {
        await RedisHelper.set(`blacklist_${bearerToken}`, "true", expiry);
      }
    }

    await this.tokenSvc.deleteTokenByUserId(userId);

    if (ctx.res) {
      clearAuthCookies(ctx.res);
    }

    return { message: "Logged out successfully" };
  }

  async clearCookies(res: any) {
    clearAuthCookies(res);
    return { message: "Cookies cleared successfully" };
  }
}
