import { InventoryIF } from "./inventory.types";


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

export interface UserIF {
  _id: string;
  userId?: string; // Backend DTO field
  email: string;
  username: string;
  bio: string;
  avatar: InventoryIF;
  banner: InventoryIF;
  twoFactorEnabled: boolean;
  role: UserRole;
  loginType: LoginType;
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
    badges: InventoryIF[];
    ownedAvatars: InventoryIF[];
    ownedBanners: InventoryIF[];
  };
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership?: {
    planId: string;
    startedAt: Date;
    expiresAt: Date;
    type: "silver" | "gold";
    isActive: boolean;
  };
  dailyRewardDay: number;
  lastRewardClaimDate: Date;
  lastSeen: Date;
  notifications: boolean;
  blockedUsers: [UserIF];
  currentUser?: boolean;
  userRank: number;
  completedDomains: number;
  timestamp: Date;
}


export interface User {
  username: string;
  email: string;
  bio: string;
  twoFactorEnabled: boolean;
  notifications: boolean;
  avatar: string | null;
  banner: string | null;
}
