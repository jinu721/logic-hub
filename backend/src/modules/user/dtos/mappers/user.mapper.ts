import { UserDocument } from "@shared/types/user.types";
import { PublicUserDTO } from "../responses/public-user.dto";
import { toPublicInventoryDTO, toPublicInventoryDTOs } from "@modules/inventory";

export const toPublicUserDTO = (user: UserDocument & { currentUser?: boolean }): PublicUserDTO => {
  return {
    userId: user._id ? user._id.toString() : "",
    email: user.email,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar ? toPublicInventoryDTO(user.avatar) : null,
    banner: user.avatar ? toPublicInventoryDTO(user.banner) : null,
    role: user.role,
    loginType: user.loginType,
    googleId: user.googleId,
    githubId: user.githubId,
    stats: {
      xpPoints: user.stats?.xpPoints || 0,
      totalXpPoints: user.stats?.totalXpPoints || 0,
      level: user.stats?.level || 0,
      currentStreak: user.stats?.currentStreak?.valueOf() || 0,
      longestStreak: user.stats?.longestStreak?.valueOf() || 0,
      lastSolvedDate: user.stats?.lastSolvedDate || null,
    },
    inventory: {
      keys: user.inventory?.keys || 0,
      badges: user.inventory?.badges ? toPublicInventoryDTOs(user.inventory.badges) : [],
      ownedAvatars: user.inventory?.ownedAvatars ? toPublicInventoryDTOs(user.inventory?.ownedAvatars) : [],
      ownedBanners: user.inventory?.ownedBanners ? toPublicInventoryDTOs(user.inventory?.ownedBanners) : [],
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
    lastSeen: user.lastSeen || null,
    currentUser: user.currentUser ? user.currentUser : false,
    notifications: user.notifications,
    timestamp: user.timestamp,
  };
};

export const toPublicUserDTOs = (users: UserDocument[]): PublicUserDTO[] => {
  return users.map(toPublicUserDTO);
};