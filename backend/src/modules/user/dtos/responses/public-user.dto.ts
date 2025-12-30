import { IPublicInventoryDTO } from "@modules/inventory/dtos";

export interface PublicUserDTO {
  userId: string;
  email: string;
  username: string;
  bio: string;
  avatar: IPublicInventoryDTO | string | null | undefined;
  banner: IPublicInventoryDTO | string | null | undefined;
  role: string;
  googleId: string | null;
  githubId: string | null;
  loginType: string;
  stats: {
    xpPoints: number;
    totalXpPoints: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate: Date | null;
  };
  inventory: {
    keys: number;
    badges: IPublicInventoryDTO[];
    ownedAvatars: IPublicInventoryDTO[];
    ownedBanners: IPublicInventoryDTO[];
  };
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership?: {
    planId: string;
    type: "silver" | "gold";
    isActive: boolean;
  };
  dailyRewardDay: number;
  lastRewardClaimDate: Date;
  twoFactorEnabled: boolean;
  lastSeen: Date | null;
  currentUser: boolean;
  notifications: boolean;
  timestamp: Date;
  [key: string]: unknown;
}

