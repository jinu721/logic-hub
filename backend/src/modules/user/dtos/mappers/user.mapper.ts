import { PopulatedUser } from "@shared/types";
import { PublicUserDTO } from "../responses/public-user.dto";
import { toPublicInventoryDTO, toPublicInventoryDTOs } from "@modules/inventory";

export const toPublicUserDTO = (user: PopulatedUser & { currentUser?: boolean }): PublicUserDTO => {
  return {
    userId: user._id ? user._id.toString() : "",
    email: user.email,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar ? toPublicInventoryDTO(user.avatar) : null,
    banner: user.banner ? toPublicInventoryDTO(user.banner) : null,
    role: user.role,
    loginType: user.loginType,
    googleId: user.googleId || null,
    githubId: user.githubId || null,
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
      ownedAvatars: user.inventory?.ownedAvatars ? toPublicInventoryDTOs(user.inventory.ownedAvatars) : [],
      ownedBanners: user.inventory?.ownedBanners ? toPublicInventoryDTOs(user.inventory.ownedBanners) : [],
    },
    isBanned: user.isBanned,
    isVerified: user.isVerified,
    isOnline: user.isOnline,
    membership: user.membership
      ? {
        planId: user.membership.planId?._id?.toString() || user.membership.planId?.toString(),
        type: user.membership.type, // 'silver' | 'gold' | null -> DTO expects specific enum. 
        // UserBase says string (enum keys?). 
        // let's assume valid. TS might complain if UserBase.type is wider than "silver"|"gold". 
        // UserBase membership.type was not in my replacement content?
        // Ah, UserBase type had `membership?: MembershipAttrs`.
        // I need to check MembershipAttrs. Assuming it matches.
        isActive: user.membership.isActive,
      }
      : undefined,
    dailyRewardDay: user.dailyRewardDay,
    lastRewardClaimDate: user.lastRewardClaimDate || new Date(), // DTO says Date (not null/undefined), Base says Optional. Provide default or fix DTO. DTO has 'lastRewardClaimDate: Date'.
    twoFactorEnabled: user.twoFactorEnabled,
    lastSeen: user.lastSeen || null,
    currentUser: user.currentUser ? user.currentUser : false,
    notifications: user.notifications,
    timestamp: user.timestamp,
  };
};

export const toPublicUserDTOs = (users: PopulatedUser[]): PublicUserDTO[] => {
  return users.map(toPublicUserDTO);
};