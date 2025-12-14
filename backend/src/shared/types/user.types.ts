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

// 1. Base interface (Primitives only) - No _id here to avoid Mongoose Document conflict
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
    // Arrays of IDs or Docs controlled by Raw/Populated separation
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

// 2. RAW Interface (Database State - ObjectIds) - Used for persistence/updates
// Does NOT strictly enforce _id unless intersected with Document or Types
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

// 3. POPULATED Interface (Application State - Full Objects) - Used for Services/DTOs
// Must have _id as it won't be intersection with Document usually
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
    planId: any; // Ideally PlanDocument or similar
  }
}

// 4. Mongoose Document (Extends RAW)
export interface UserDocument extends UserRaw, Document {
  // Mongoose methods
}

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
