import { PopulatedUser, InventoryDocument, PopulatedInventory } from "@shared/types";
import { PublicUserDTO } from "../responses/public-user.dto";
import { toPublicInventoryDTO, toPublicInventoryDTOs, IPublicInventoryDTO } from "@modules/inventory";
import { generateSignedImageUrl } from "@utils/application";

// Helper function to convert InventoryDocument to IPublicInventoryDTO
const inventoryDocumentToDTO = (item: unknown): IPublicInventoryDTO => {
  const doc = item as InventoryDocument;
  return {
    _id: doc._id?.toString() || "",
    name: doc.name || "",
    description: doc.description || "",
    image: generateSignedImageUrl(doc.image || ""),
    isActive: doc.isActive || false,
    rarity: doc.rarity || "common",
  };
};

// Helper function to check if inventory item is populated
const isPopulatedInventory = (item: unknown): item is InventoryDocument => {
  return item !== null && typeof item === 'object' && 'name' in item;
};

export const toPublicUserDTO = (user: PopulatedUser & { currentUser?: boolean }): PublicUserDTO => {
  return {
    userId: user._id ? user._id.toString() : "",
    email: user.email,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar ? (isPopulatedInventory(user.avatar) ? toPublicInventoryDTO(user.avatar as PopulatedInventory) : inventoryDocumentToDTO(user.avatar)) : null,
    banner: user.banner ? (isPopulatedInventory(user.banner) ? toPublicInventoryDTO(user.banner as PopulatedInventory) : inventoryDocumentToDTO(user.banner)) : null,
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
      badges: user.inventory?.badges ? user.inventory.badges.map(item =>
        isPopulatedInventory(item) ? toPublicInventoryDTO(item as PopulatedInventory)! : inventoryDocumentToDTO(item)
      ).filter(Boolean) : [],
      ownedAvatars: user.inventory?.ownedAvatars ? user.inventory.ownedAvatars.map(item =>
        isPopulatedInventory(item) ? toPublicInventoryDTO(item as PopulatedInventory)! : inventoryDocumentToDTO(item)
      ).filter(Boolean) : [],
      ownedBanners: user.inventory?.ownedBanners ? user.inventory.ownedBanners.map(item =>
        isPopulatedInventory(item) ? toPublicInventoryDTO(item as PopulatedInventory)! : inventoryDocumentToDTO(item)
      ).filter(Boolean) : [],
    },
    isBanned: user.isBanned,
    isVerified: user.isVerified,
    isOnline: user.isOnline,
    membership: user.membership
      ? {
        planId: user.membership.planId?._id?.toString() || user.membership.planId?.toString() || "",
        type: user.membership.type,
        isActive: user.membership.isActive,
      }
      : undefined,
    dailyRewardDay: user.dailyRewardDay,
    lastRewardClaimDate: user.lastRewardClaimDate || null,
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