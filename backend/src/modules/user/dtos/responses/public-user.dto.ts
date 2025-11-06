import { IPublicInventoryDTO } from "./inventory.dto";

export interface PublicUserDTO {
  userId: string;
  email: string;
  username: string;
  bio: string;
  avatar: IPublicInventoryDTO | null | undefined;
  banner: IPublicInventoryDTO | null | undefined;
  role: string;
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
}

