import { UserIF } from "../types/user.types";
import { IPublicInventoryDTO, toPublicInventoryDTO, toPublicInventoryDTOs } from "./inventory.dto";

export interface PublicUserDTO {
  _id: string;
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

export const toPublicUserDTO = (user: UserIF & { currentUser?: boolean }): PublicUserDTO => {
  return {
    _id: user._id? user._id.toString() : "",
    email: user.email,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar ? toPublicInventoryDTO(user.avatar as any) : null,
    banner: user.avatar ? toPublicInventoryDTO(user.banner as any) : null,
    role: user.role,
    loginType: user.loginType,
    stats: {
      xpPoints: user.stats?.xpPoints || 0,
      totalXpPoints: user.stats?.totalXpPoints || 0,
      level: user.stats?.level || 0,
      currentStreak: (user.stats?.currentStreak as any)?.valueOf() || 0,
      longestStreak: (user.stats?.longestStreak as any)?.valueOf() || 0,
      lastSolvedDate: user.stats?.lastSolvedDate as any || null,
    },
    inventory:  {
      keys: user.inventory?.keys || 0,
      badges: user.inventory?.badges ? toPublicInventoryDTOs(user.inventory.badges as any) : [],
      ownedAvatars: user.inventory?.ownedAvatars ? toPublicInventoryDTOs(user.inventory?.ownedAvatars as any) : [],
      ownedBanners: user.inventory?.ownedBanners ? toPublicInventoryDTOs(user.inventory?.ownedBanners as any) : [],
    },
    isBanned: user.isBanned,
    isVerified: user.isVerified,
    isOnline: user.isOnline,
    membership: user.membership
      ? {
          planId: user.membership.planId,
          type: user.membership.type,
          isActive: user.membership.isActive,
        }
      : undefined,
    dailyRewardDay: user.dailyRewardDay,
    lastRewardClaimDate: user.lastRewardClaimDate,
    twoFactorEnabled: user.twoFactorEnabled,
    lastSeen: (user.lastSeen as any) || null,
    currentUser:user.currentUser ? user.currentUser : false,
    notifications: user.notifications,
    timestamp: user.timestamp,
  };
};

export const toPublicUserDTOs = (users: UserIF[]): PublicUserDTO[] => {
  return users.map(toPublicUserDTO);
};