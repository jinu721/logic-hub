import { Document } from "mongoose";
import { MembershipIF } from "./membership.types";

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

interface Badge {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  requirements: {
    type: string;
    value: number;
  };
  rarity: string;
  isActive: boolean;
  timestamp: Date;
}


export interface UserIF extends Document {
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
    badges: [Badge];
    ownedAvatars: [string];
    ownedBanners: [string];
  };
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership?: MembershipIF;
  dailyRewardDay: number;
  lastRewardClaimDate: Date;
  lastSeen: Date;
  notifications: boolean;
  blockedUsers: [UserIF];
  timestamp: Date;
}

