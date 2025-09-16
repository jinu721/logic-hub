import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserService } from "../interfaces/user.services.interface";
import { UserIF } from "../../types/user.types";
import {
  PublicUserDTO,
  toPublicUserDTO,
  toPublicUserDTOs,
} from "../../mappers/user.dto";
import { env } from "../../config/env";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";
import { IChallengeProgressRepository } from "../../repository/interfaces/progress.repository.interface";
import { toObjectId } from "../../utils/application/objectId.convertion";
import { ITokenProvider } from "../../providers/token/auth.token.interface";
import { IEmailProvider } from "../../providers/email/email.sender.interface";
import { IHashProvider } from "../../providers/hashing/secure.hasher.interface";
import { IPendingUserRepository } from "../../repository/interfaces/pending-user.repository.interface";
import { generateOTP } from "../../utils/application/generate.otp";
import { BaseService } from "../base.service";

type UserData = PublicUserDTO & {
  userRank: number;
  completedDomains: number;
  currentUser: boolean;
};

export class UserService extends BaseService<UserIF, PublicUserDTO> implements IUserService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _pendingUserRepo: IPendingUserRepository,
    private readonly _progressRepo: IChallengeProgressRepository,
    private readonly _tokenProv: ITokenProvider,
    private readonly _emailProv: IEmailProvider,
    private readonly _hashProv: IHashProvider
  ) {
    super();
  }

  protected toDTO(user: UserIF): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: UserIF[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  private async getUserData(
    user: UserIF,
    currentUserId: string
  ): Promise<UserData> {
    const userRank = await this._userRepo.findUserRank(user._id as string);
    const completedDomains =
      await this._progressRepo.findCompletedDomainsByUser(
        toObjectId(user._id as string)
      );
    return {
      ...this.mapOne(user)!,
      userRank,
      completedDomains,
      currentUser: user._id?.toString() === currentUserId,
    };
  }

  private hasClaimedToday(date: Date | null): boolean {
    if (!date) return false;
    const last = new Date(date),
      now = new Date();
    return (
      last.getDate() === now.getDate() &&
      last.getMonth() === now.getMonth() &&
      last.getFullYear() === now.getFullYear()
    );
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ email: string }> {
    const exists =
      (await this._userRepo.getByEmailOrUsername(username)) ||
      (await this._userRepo.getByEmailOrUsername(email));
    if (exists) throw new Error("User Already Exist");

    const hashed = await this._hashProv.hashPassword(password);
    const otp = generateOTP();
    await this._pendingUserRepo.createPendingUser({
      username,
      email,
      password: hashed,
      otp,
    });
    await this._emailProv.sendOTP(email, otp);
    return { email };
  }

  async login(emailOrUsername: string, password: string): Promise<any> {
    const user = await this._userRepo.getByEmailOrUsername(emailOrUsername);
    if (!user) throw new Error("User Not Found");

    if (user.loginType !== "normal")
      throw new Error("Please log in with GitHub or Google.");

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    if (user.isBanned)
      return { emailOrUsername, isBanned: true, message: "User Banned" };
    if (user.twoFactorEnabled) {
      const token = this._tokenProv.generateLinkToken(this.mapOne(user));
      const link = `${env.FRONTEND_URL}/auth/verify-login?token=${token}`;
      await this._emailProv.sendLink(user.email, link);
      return { security: true, message: "Email Verification Sent" };
    }

    const accessToken = this._tokenProv.generateAccessToken(this.mapOne(user));
    const refreshToken = this._tokenProv.generateRefreshToken(this.mapOne(user));

    console.log("User logged in successfully");
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    return {
      security: false,
      isVerified: true,
      accessToken,
      refreshToken,
      userId: String(user._id),
    };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: PublicUserDTO;
  }> {
    const user = await this._pendingUserRepo.findPendingUserByEmail(email);
    if (!user) throw new Error("User Not Found");
    const { username, password, otp: userOtp } = user;
    if (userOtp !== Number(otp)) throw new Error("Invalid OTP");
    await this._userRepo.createUser({ username, email, password });
    await this._pendingUserRepo.deletePendingUser(email);
    const userData = await this._userRepo.getByEmailOrUsername(email);
    if (!userData) throw new Error("User Not Found");
    const accessToken = this._tokenProv.generateAccessToken(
      this.mapOne(userData)
    );
    const refreshToken = this._tokenProv.generateRefreshToken(
      this.mapOne(userData)
    );
    return { accessToken, refreshToken, userData: this.mapOne(userData) };
  }

  async resendOtp(email: string): Promise<void> {
    const pendingUser = await this._pendingUserRepo.findPendingUserByEmail(
      email
    );
    if (!pendingUser) throw new Error("User not found or already verified");

    const otp = generateOTP();

    await this._pendingUserRepo.updatePendingUserOtp(email, otp);

    await this._emailProv.sendOTP(email, otp);
  }

  async verifyLogin(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    const decoded = jwt.verify(token, env.VERIFY_TOKEN_SECRET as string) as {
      userId: string;
    };
    const user = await this._userRepo.getUserById(decoded.userId);
    if (!user) throw new Error("User Not Found");
    const accessToken = this._tokenProv.generateAccessToken(this.mapOne(user));
    const refreshToken = this._tokenProv.generateRefreshToken(this.mapOne(user));
    return { accessToken, refreshToken, userId: user._id as string };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this._userRepo.getByEmailOrUsername(email);
    if (!user) throw new Error("Email not found");

    const token = this._tokenProv.generateResetToken(this.mapOne(user));
    const link = `${env.FRONTEND_URL}/auth/reset?token=${token}`;
    await this._emailProv.sendLink(email, link);
    return { message: "Verification Link Sent" };
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User Not Found");
    const hashedPassword = await this._hashProv.hashPassword(password);
    await this._userRepo.updateUser(toObjectId(userId), {
      password: hashedPassword,
    });
  }

  async findByEmailOrUsername(value: string): Promise<boolean> {
    const res = await this._userRepo.getByEmailOrUsername(value);
    return !res;
  }

  async findUserById(id: string): Promise<UserData> {
    const user = await this._userRepo.getUserById(id);
    if (!user) throw new Error("User not found");
    return this.getUserData(user, id);
  }

  async findUserByName(
    username: string,
    currentUserId: string
  ): Promise<UserData> {
    const user = await this._userRepo.getByEmailOrUsername(username);
    if (!user) throw new Error("User not found");
    return this.getUserData(user, currentUserId);
  }

  async findUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: PublicUserDTO[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const [users, totalItems] = await Promise.all([
      this._userRepo.findAllUsers(search, skip, limit),
      this._userRepo.countAllUsers(search),
    ]);
    if (!users || users.length === 0) throw new Error("Users not found");
    return { users: this.mapMany(users), totalItems };
  }

  async searchUsers(search: string): Promise<PublicUserDTO[]> {
    const users = await this._userRepo.searchUsers(search);
    if (!users || users.length === 0) throw new Error("Users not found");
    return this.mapMany(users);
  }

  async toggleBanStatus(userId: string): Promise<{ isBanned: boolean }> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");
    const newStatus = !user.isBanned;
    await this._userRepo.updateUser(toObjectId(userId), {
      isBanned: newStatus,
    });
    return { isBanned: newStatus };
  }

  async findUserByIdAndUpdate(
    id: string,
    data: Partial<UserIF>
  ): Promise<PublicUserDTO | null> {
    const updated = await this._userRepo.updateUser(toObjectId(id), data);
    if (!updated) throw new Error("User not found");
    return this.mapOne(updated);
  }

  async giftItem(
    userId: string,
    itemId: string,
    type: string
  ): Promise<PublicUserDTO | null> {
    const valid = {
      avatars: "inventory.ownedAvatars",
      banners: "inventory.ownedBanners",
      badges: "inventory.badges",
    } as const;
    const path = valid[type as keyof typeof valid];
    if (!path) throw new Error("Invalid gift type");
    const updated = await this._userRepo.updateUser(toObjectId(userId), {[path]: toObjectId(itemId) });
    return this.mapOne(updated as UserIF);
  }

  async setUserOnline(
    userId: string,
    isOnline: boolean
  ): Promise<PublicUserDTO | null> {
    const user = await this._userRepo.updateUser(toObjectId(userId), {
      isOnline,
      lastSeen: isOnline ? undefined : new Date(),
    });
    return this.mapOne(user as UserIF);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<PublicUserDTO | null> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");
    const isPasswordValid = await this._hashProv.comparePasswords(
      oldPassword,
      user.password as string
    );
    if (!isPasswordValid) throw new Error("Invalid old password");
    const hashed = await this._hashProv.hashPassword(newPassword);
    const updated = await this._userRepo.updateUser(toObjectId(userId), {
      password: hashed,
    });
    return this.mapOne(updated as UserIF);
  }

  async updateUser(
    userId: string,
    data: Partial<UserIF>
  ): Promise<PublicUserDTO | null> {
    const updated = await this._userRepo.updateUser(toObjectId(userId), data);
    return this.mapOne(updated as UserIF);
  }

  async toggleUserNotification(userId: string): Promise<PublicUserDTO | null> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");
    const updated = await this._userRepo.updateUser(toObjectId(userId), {
      notifications: !user.notifications,
    });
    if (updated === null) throw new Error("User not found");
    return this.mapOne(updated as UserIF);
  }

  async cancelMembership(userId: string): Promise<boolean> {
    if (!userId) throw new Error("Unauthorized");
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");
    if (!user.membership) throw new Error("User has no active membership");
    await this._userRepo.updateUser(toObjectId(userId), {
      membership: { ...user.membership, isActive: false },
    });
    return true;
  }

  async claimDailyReward(userId: string): Promise<PublicUserDTO> {
    const rewardMap = {
      1: 50,
      2: 100,
      3: 150,
      4: 200,
      5: 250,
      6: 300,
      7: 500,
    } as const;
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");
    if (this.hasClaimedToday(user.lastRewardClaimDate))
      throw new Error("Reward already claimed today");

    const current = user.dailyRewardDay || 1;
    const next = current === 7 ? 1 : current + 1;
    let reward = rewardMap[next as keyof typeof rewardMap];
    if (user.membership?.isActive && user.membership.type === "gold")
      reward *= 2;

    const updated = await this._userRepo.updateUser(toObjectId(userId), {
      dailyRewardDay: next,
      lastRewardClaimDate: new Date(),
      stats: {
        ...user.stats,
        xpPoints: user.stats.xpPoints + reward,
        totalXpPoints: user.stats.totalXpPoints + reward,
      },
    });

    return this.mapOne(updated as UserIF)!;
  }
}
