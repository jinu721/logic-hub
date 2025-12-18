import { Document, Types } from "mongoose";
import { MembershipAttrs } from "./membership.types";
import { InventoryDocument } from "./inventory.types";

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

export interface UserBase {
  email: string;
  username: string;
  bio: string;
  password: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  role: UserRole;
  loginType: LoginType;
  googleId?: string;
  githubId?: string;
  stats: {
    xpPoints: number;
    totalXpPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate?: Date;
  };
  inventory: {
    keys: number;
  };
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership?: MembershipAttrs;
  dailyRewardDay: number;
  lastRewardClaimDate?: Date;
  lastSeen?: Date;
  notifications: boolean;
  timestamp: Date;
}

export interface UserRaw extends UserBase {
  avatar: Types.ObjectId | null;
  banner: Types.ObjectId | null;
  inventory: UserBase['inventory'] & {
    badges: Types.ObjectId[];
    ownedAvatars: Types.ObjectId[];
    ownedBanners: Types.ObjectId[];
  };
  blockedUsers: Types.ObjectId[];
  membership?: MembershipAttrs & {
    planId: Types.ObjectId | null;
  }
}

export interface PopulatedUser extends UserBase {
  _id: Types.ObjectId;
  avatar: InventoryDocument | null;
  banner: InventoryDocument | null;
  inventory: UserBase['inventory'] & {
    badges: InventoryDocument[];
    ownedAvatars: InventoryDocument[];
    ownedBanners: InventoryDocument[];
  };
  blockedUsers: Types.ObjectId[];
  membership?: MembershipAttrs & {
    planId: Types.ObjectId | null | string; 
  }
}

export interface UserDocument extends UserRaw, Document {}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  twoFactorEnabled?: boolean;
  notifications?: boolean;
}

export interface SocialLoginInput {
  name: string;
  email: string;
  loginType: LoginType;
  profileId: string;
}
