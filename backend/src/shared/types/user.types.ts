import { Types } from "mongoose";
import { MembershipAttrs } from "./membership.types";

export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}
export enum LoginType {
  NORMAL = "normal",
  GOOGLE = "google",
  GITHUB = "github",
}

export interface UserAttrs{
  email: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
  password: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  role: UserRole;
  loginType: LoginType;
  googleId: string;
  githubId: string;
  stats: {
    xpPoints: number;
    totalXpPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate: Date;
  };
  inventory: {
    keys: number;
    badges: [Types.ObjectId];
    ownedAvatars: [Types.ObjectId];
    ownedBanners: [Types.ObjectId];
  };
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership?: MembershipAttrs;
  dailyRewardDay: number;
  lastRewardClaimDate: Date;
  lastSeen: Date;
  notifications: boolean;
  blockedUsers: [UserAttrs];
  timestamp: Date;
}

export interface CreateUserInput {
    email: string;
    username: string;
    password: string;
}

export interface SocialLoginInput {
    name: string;
    email: string;
    loginType: LoginType;
    profileId: string;
}


