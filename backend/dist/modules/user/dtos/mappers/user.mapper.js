"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicUserDTOs = exports.toPublicUserDTO = void 0;
const inventory_1 = require("../../../inventory");
const application_1 = require("../../../../shared/utils/application");
// Helper function to convert InventoryDocument to IPublicInventoryDTO
const inventoryDocumentToDTO = (item) => {
    var _a;
    const doc = item;
    return {
        _id: ((_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
        name: doc.name || "",
        description: doc.description || "",
        image: (0, application_1.generateSignedImageUrl)(doc.image || ""),
        isActive: doc.isActive || false,
        rarity: doc.rarity || "common",
    };
};
// Helper function to check if inventory item is populated
const isPopulatedInventory = (item) => {
    return item !== null && typeof item === 'object' && 'name' in item;
};
const toPublicUserDTO = (user) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return {
        userId: user._id ? user._id.toString() : "",
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar ? (isPopulatedInventory(user.avatar) ? (0, inventory_1.toPublicInventoryDTO)(user.avatar) : inventoryDocumentToDTO(user.avatar)) : null,
        banner: user.banner ? (isPopulatedInventory(user.banner) ? (0, inventory_1.toPublicInventoryDTO)(user.banner) : inventoryDocumentToDTO(user.banner)) : null,
        role: user.role,
        loginType: user.loginType,
        googleId: user.googleId || null,
        githubId: user.githubId || null,
        stats: {
            xpPoints: ((_a = user.stats) === null || _a === void 0 ? void 0 : _a.xpPoints) || 0,
            totalXpPoints: ((_b = user.stats) === null || _b === void 0 ? void 0 : _b.totalXpPoints) || 0,
            level: ((_c = user.stats) === null || _c === void 0 ? void 0 : _c.level) || 0,
            currentStreak: ((_e = (_d = user.stats) === null || _d === void 0 ? void 0 : _d.currentStreak) === null || _e === void 0 ? void 0 : _e.valueOf()) || 0,
            longestStreak: ((_g = (_f = user.stats) === null || _f === void 0 ? void 0 : _f.longestStreak) === null || _g === void 0 ? void 0 : _g.valueOf()) || 0,
            lastSolvedDate: ((_h = user.stats) === null || _h === void 0 ? void 0 : _h.lastSolvedDate) || null,
        },
        inventory: {
            keys: ((_j = user.inventory) === null || _j === void 0 ? void 0 : _j.keys) || 0,
            badges: ((_k = user.inventory) === null || _k === void 0 ? void 0 : _k.badges) ? user.inventory.badges.map(item => isPopulatedInventory(item) ? (0, inventory_1.toPublicInventoryDTO)(item) : inventoryDocumentToDTO(item)).filter(Boolean) : [],
            ownedAvatars: ((_l = user.inventory) === null || _l === void 0 ? void 0 : _l.ownedAvatars) ? user.inventory.ownedAvatars.map(item => isPopulatedInventory(item) ? (0, inventory_1.toPublicInventoryDTO)(item) : inventoryDocumentToDTO(item)).filter(Boolean) : [],
            ownedBanners: ((_m = user.inventory) === null || _m === void 0 ? void 0 : _m.ownedBanners) ? user.inventory.ownedBanners.map(item => isPopulatedInventory(item) ? (0, inventory_1.toPublicInventoryDTO)(item) : inventoryDocumentToDTO(item)).filter(Boolean) : [],
        },
        isBanned: user.isBanned,
        isVerified: user.isVerified,
        isOnline: user.isOnline,
        membership: user.membership
            ? {
                planId: ((_p = (_o = user.membership.planId) === null || _o === void 0 ? void 0 : _o._id) === null || _p === void 0 ? void 0 : _p.toString()) || ((_q = user.membership.planId) === null || _q === void 0 ? void 0 : _q.toString()) || "",
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
exports.toPublicUserDTO = toPublicUserDTO;
const toPublicUserDTOs = (users) => {
    return users.map(exports.toPublicUserDTO);
};
exports.toPublicUserDTOs = toPublicUserDTOs;
