import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../repository/implements/user.repository";
import { OTPServices } from "./otp.service";
import { sendEmail } from "../../utils/send.email";
import { IUserService } from "../interfaces/user.services.interface";
import { UserIF } from "../../types/user.types";
import {
  generateAccessToken,
  generateLinkToken,
  generateRefreshToken,
} from "../../utils/generate.token";
import { Types } from "mongoose";
import { ChallengeProgressRepository } from "../../repository/implements/progress.repository";
import {
  PublicUserDTO,
  toPublicUserDTO,
  toPublicUserDTOs,
} from "../../mappers/user.dto";

type UserData = PublicUserDTO & {
  userRank: number;
  completedDomains: number;
  currentUser: boolean;
};

export class UserService implements IUserService {
  constructor(
    private userRepo: UserRepository,
    private OTPServices: OTPServices,
    private progressRepo: ChallengeProgressRepository
  ) {}

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ email: string }> {
    const exists =
      (await this.userRepo.getByEmailOrUsername(username)) ||
      (await this.userRepo.getByEmailOrUsername(email));
    if (exists) throw new Error("User Already Exist");

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepo.create({
      username,
      email,
      password: hashed,
      isVerified: false,
    });

    const otp = await this.OTPServices.generateOrUpdateOTP(email);
    await sendEmail({
      to: email,
      subject: "Verify your account",
      content: `Your OTP is: ${otp}`,
      type: "otp",
    });
    return { email };
  }

  async verifyOTP(email: string, otp: string): Promise<PublicUserDTO | null> {
    const valid = await this.OTPServices.verifyOTP(email, otp);
    if (!valid) throw new Error("Invalid OTP");
    await this.userRepo.verifyAccount(email);
    const user = await this.userRepo.getByEmailOrUsername(email);
    return toPublicUserDTO(user as UserIF);
  }

  async resendOtp(email: string): Promise<void> {
    const otp = await this.OTPServices.generateOrUpdateOTP(email);
    await sendEmail({
      to: email,
      subject: "Verify your account",
      content: `Your OTP is: ${otp}`,
      type: "otp",
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<
    | { email: string; isBanned: true; message: string }
    | { email: string; isVerified: false; message: string }
    | { security: true; isVerified: true; message: string }
    | {
        security: false;
        isVerified: true;
        accessToken: string;
        refreshToken: string;
        userId: string;
      }
  > {
    const user = await this.userRepo.getByEmailOrUsername(email);
    if (!user) throw new Error("User Not Found");
    if (user.loginType !== "normal")
      throw new Error("Please log in with GitHub or Google.");

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    if (user.isBanned) return { email, isBanned: true, message: "User Banned" };
    if (!user.isVerified) {
      const otp = await this.OTPServices.generateOrUpdateOTP(email);
      await sendEmail({
        to: email,
        subject: "Verify your account",
        content: `Your OTP is: ${otp}`,
        type: "otp",
      });
      return { email, isVerified: false, message: "OTP Verification Sent" };
    }
    if (user.twoFactorEnabled) {
      const token = generateLinkToken(user as PublicUserDTO);
      const link = `${process.env.FRONTEND_URL}/auth/verify-login?token=${token}`;
      await sendEmail({
        to: user.email as string,
        subject: "Verify your account",
        content: "Your Verification Link",
        type: "link",
        link,
      });
      return {
        security: true,
        isVerified: true,
        message: "Email Verification Sent",
      };
    }
    return {
      security: false,
      isVerified: true,
      accessToken: generateAccessToken(user as PublicUserDTO),
      refreshToken: generateRefreshToken(user as PublicUserDTO),
      userId: user._id as string,
    };
  }

  async verifyLogin(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    const decoded = jwt.verify(
      token,
      process.env.VERIFY_TOKEN_SECRET as string
    ) as { userId: string };
    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new Error("User Not Found");
    return {
      accessToken: generateAccessToken(user as PublicUserDTO),
      refreshToken: generateRefreshToken(user as PublicUserDTO),
      userId: user._id as string,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepo.getByEmailOrUsername(email);
    if (!user) throw new Error("Email not found");

    const token = generateLinkToken(user as PublicUserDTO);
    const link = `${process.env.FRONTEND_URL}/auth/reset?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset Password",
      content: "Your Verification Link",
      type: "link",
      link,
    });
    return { message: "Verification Link Sent" };
  }

  async resetPassword(
    userId: string,
    password: string
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User Not Found");
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepo.updateOne({ _id: userId }, { password: hashedPassword });
  }

  async findByEmailOrUsername(value: string): Promise<boolean> {
    const res = await this.userRepo.getByEmailOrUsername(value);
    return !res;
  }

  async findUserById(id: string): Promise<UserData> {
    console.log("userID", id);
    const user = await this.userRepo.getUserById(id);
    if (!user) throw new Error("User not found");
    const userRank = await this.userRepo.findUserRank(id);
    const safedUser = toPublicUserDTO(user);
    const completedDomains = await this.progressRepo.findCompletedDomainsByUser(
      id
    );
    return {
      ...safedUser,
      userRank,
      completedDomains,
      currentUser: user?._id?.toString() === id,
    };
  }

  async findUserByName(
    username: string,
    currentUserId: string
  ): Promise<UserData> {
    console.log("Username", username);
    console.log("currentUserId", currentUserId);
    const user = await this.userRepo.getByEmailOrUsername(username);
    if (!user) throw new Error("User not found");
    const userRank = await this.userRepo.findUserRank(user._id as string);
    const safedUser = toPublicUserDTO(user);
    const completedDomains = await this.progressRepo.findCompletedDomainsByUser(
      user._id as string
    );

    const userId = user._id as string;


    return {
      ...safedUser,
      userRank,
      completedDomains,
      currentUser: userId.toString() === currentUserId,
    };
  }

  async findUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{users:PublicUserDTO[],totalItems:number}> {
    const skip = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      this.userRepo.findAllUsers(search, skip, limit),
      this.userRepo.countAllUsers(search),
    ]);

    if (!users || users.length === 0) {
      throw new Error("Users not found");
    }

  return {
    users: toPublicUserDTOs(users),
    totalItems,
  };
  }

  async searchUsers(search: string): Promise<PublicUserDTO[] | null> {
    const users = await this.userRepo.searchUsers(search);
    if (!users || users.length === 0) {
      throw new Error("Users not found");
    }
    return toPublicUserDTOs(users);
  }

  async toggleBanStatus(userId: string): Promise<{ isBanned: boolean }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    const newStatus = !user.isBanned;
    const newUserId = new Types.ObjectId(userId);
    await this.userRepo.update(newUserId, { isBanned: newStatus });
    return { isBanned: newStatus };
  }

  async findUserByIdAndUpdate(
    id: string,
    data: Partial<UserIF>
  ): Promise<PublicUserDTO | null> {
    const newUserId = new Types.ObjectId(id);
    const updated = (await this.userRepo.update(
      newUserId,
      data
    )) as UserIF | null;
    if (!updated) throw new Error("User not found");
    return toPublicUserDTO(updated);
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

    const updated = await this.userRepo.updateOne(
      { _id: userId },
      { $addToSet: { [path]: new Types.ObjectId(itemId) } }
    );
    return toPublicUserDTO(updated as UserIF) as PublicUserDTO | null;
  }

  async setUserOnline(
    userId: string,
    isOnline: boolean
  ): Promise<PublicUserDTO | null> {
    const user = this.userRepo.setUserOnline(userId, {
      isOnline,
      lastSeen: isOnline ? null : new Date(),
    });
    return toPublicUserDTO(user as any);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<PublicUserDTO | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password as string
    );
    if (!isPasswordValid) throw new Error("Invalid old password");

    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = this.userRepo.updateOne(
      { _id: userId },
      { password: hashed }
    );
    return toPublicUserDTO(updated as any);
  }

  async updateUser(
    userId: string,
    data: Partial<PublicUserDTO>
  ): Promise<PublicUserDTO | null> {
    const updated = await this.userRepo.updateOne({ _id: userId }, data);
    return toPublicUserDTO(updated as UserIF);
  }

  async toggleUserNotification(userId: string): Promise<PublicUserDTO | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    const newUserId = new Types.ObjectId(userId);
    const updated = await this.userRepo.update(newUserId, {
      notifications: !user.notifications,
    });
    return toPublicUserDTO(updated as UserIF);
  }

  async cancelMembership(userId: string): Promise<boolean> {
    if (!userId) throw new Error("Unauthorized");
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    await this.userRepo.cancelMembership(user._id as string);
    return true;
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
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    if (this.hasClaimedToday(user.lastRewardClaimDate))
      throw new Error("Reward already claimed today");

    const current = user.dailyRewardDay || 1;
    const next = current === 7 ? 1 : current + 1;
    let reward = rewardMap[next as keyof typeof rewardMap];
    if (user.membership?.isActive && user.membership.type === "gold") {
      reward *= 2;
    }

    const newUserId = new Types.ObjectId(userId);

    const updated = await this.userRepo.update(newUserId, {
      dailyRewardDay: next,
      lastRewardClaimDate: new Date(),
      stats: {
        ...user.stats,
        xpPoints: user.stats.xpPoints + reward,
        totalXpPoints: user.stats.totalXpPoints + reward,
      },
    });
    return toPublicUserDTO(updated as UserIF) as PublicUserDTO;
  }
}
