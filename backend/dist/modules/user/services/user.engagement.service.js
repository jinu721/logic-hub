"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEngagementService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const user_1 = require("../../user");
class UserEngagementService extends _core_1.BaseService {
    constructor(_userRepo, _marketSvc) {
        super();
        this._userRepo = _userRepo;
        this._marketSvc = _marketSvc;
    }
    toDTO(user) {
        return (0, user_1.toPublicUserDTO)(user);
    }
    toDTOs(users) {
        return (0, user_1.toPublicUserDTOs)(users);
    }
    getPopulated(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return user;
        });
    }
    hasClaimedToday(date) {
        if (!date)
            return false;
        const now = new Date();
        const last = new Date(date);
        return (last.getDate() === now.getDate() &&
            last.getMonth() === now.getMonth() &&
            last.getFullYear() === now.getFullYear());
    }
    claimDailyReward(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const rewardMap = {
                1: 50,
                2: 100,
                3: 150,
                4: 200,
                5: 250,
                6: 300,
                7: 500,
            };
            const user = yield this._userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            if (this.hasClaimedToday(user.lastRewardClaimDate)) {
                throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "Reward already claimed today");
            }
            const current = user.dailyRewardDay || 1;
            const next = current === 7 ? 1 : current + 1;
            let reward = rewardMap[next];
            if (((_a = user.membership) === null || _a === void 0 ? void 0 : _a.isActive) && user.membership.type === "gold") {
                reward *= 2;
            }
            const updated = yield this._userRepo.updateUser((0, application_1.toObjectId)(userId), {
                dailyRewardDay: next,
                lastRewardClaimDate: new Date(),
                stats: Object.assign(Object.assign({}, user.stats), { xpPoints: user.stats.xpPoints + reward, totalXpPoints: user.stats.totalXpPoints + reward }),
            });
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update reward");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    cancelMembership(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            if (!user.membership) {
                throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "User has no active membership");
            }
            yield this._userRepo.updateUser((0, application_1.toObjectId)(userId), {
                membership: Object.assign(Object.assign({}, user.membership), { isActive: false }),
            });
            return true;
        });
    }
    giftItem(userId, itemId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = {
                avatars: "inventory.ownedAvatars",
                banners: "inventory.ownedBanners",
                badges: "inventory.badges",
            };
            const path = valid[type];
            if (!path)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Invalid gift type");
            const updateQuery = {
                $push: { [path]: (0, application_1.toObjectId)(itemId) }
            };
            const updated = yield this._userRepo.updateUser((0, application_1.toObjectId)(userId), updateQuery);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    setUserOnline(userId, isOnline) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this._userRepo.updateUser((0, application_1.toObjectId)(userId), {
                isOnline,
                lastSeen: isOnline ? undefined : new Date(),
            });
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return this.mapOne(yield this.getPopulated(userId));
        });
    }
    purchaseMarketItem(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this._marketSvc.getItemById(id);
            if (!item)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Item not found");
            const user = yield this._userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            if (user.stats.xpPoints < item.costXP) {
                throw new application_1.AppError(_constants_1.HttpStatus.FORBIDDEN, "Not enough XP");
            }
            // Prepare Raw Update
            const newXp = user.stats.xpPoints - item.costXP;
            const itemObjectId = (0, application_1.toObjectId)(item.itemId._id);
            // Extract current IDs from populated docs
            const ownedAvatars = user.inventory.ownedAvatars.map(d => d._id);
            const ownedBanners = user.inventory.ownedBanners.map(d => d._id);
            const badges = user.inventory.badges.map(d => d._id);
            if (item.category === "avatar") {
                ownedAvatars.push(itemObjectId);
            }
            else if (item.category === "banner") {
                ownedBanners.push(itemObjectId);
            }
            else {
                badges.push(itemObjectId);
            }
            const updateData = {
                stats: Object.assign(Object.assign({}, user.stats), { xpPoints: newXp }),
                inventory: Object.assign(Object.assign({}, user.inventory), { ownedAvatars,
                    ownedBanners,
                    badges }) // UserRaw Inventory has ObjectId[]
            };
            // Cast intermediate because UserDocument extends UserRaw which has inventory: {...}. 
            // And user.inventory coming from PopulatedUser has docs. 
            // I am reconstructing it.
            yield this._userRepo.updateUser(user._id, updateData);
            return item;
        });
    }
}
exports.UserEngagementService = UserEngagementService;
