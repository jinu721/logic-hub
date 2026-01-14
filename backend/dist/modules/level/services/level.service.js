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
exports.LevelService = void 0;
const level_1 = require("../../level");
class LevelService {
    constructor(_levelRepo, _userRepo) {
        this._levelRepo = _levelRepo;
        this._userRepo = _userRepo;
    }
    createLevel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield this._levelRepo.getLevelByLevel(data.levelNumber);
            if (isExist) {
                throw new Error("Level already exists with this level number");
            }
            // Convert DTO to document data
            const levelData = {
                levelNumber: data.levelNumber,
                requiredXP: data.requiredXP,
                description: data.description,
                rewards: data.rewards || []
            };
            const level = yield this._levelRepo.createLevel(levelData);
            return (0, level_1.toPublicLevelDTO)(level);
        });
    }
    getLevelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const level = yield this._levelRepo.getLevelById(id);
            if (!level)
                return null;
            return (0, level_1.toPublicLevelDTO)(level);
        });
    }
    getAllLevels(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const levels = yield this._levelRepo.getAllLevels(skip, limit);
            const totalItems = yield this._levelRepo.countAllLevels();
            return { levels: (0, level_1.toPublicLevelDTOs)(levels), totalItems };
        });
    }
    updateLevel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.levelNumber !== undefined) {
                const isExist = yield this._levelRepo.getLevelByLevel(data.levelNumber);
                if (isExist && String(isExist._id) !== id) {
                    throw new Error("Level already exists with this level number");
                }
            }
            // Convert DTO to document data
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign({}, (data.levelNumber !== undefined && { levelNumber: data.levelNumber })), (data.requiredXP !== undefined && { requiredXP: data.requiredXP })), (data.description !== undefined && { description: data.description })), (data.rewards !== undefined && { rewards: data.rewards }));
            const updated = yield this._levelRepo.updateLevel(id, updateData);
            if (!updated)
                return null;
            return (0, level_1.toPublicLevelDTO)(updated);
        });
    }
    getLevelByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._levelRepo.getLevelByLevel(level);
            if (!result)
                return null;
            return (0, level_1.toPublicLevelDTO)(result);
        });
    }
    deleteLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this._levelRepo.deleteLevel(id);
            if (!deleted)
                return null;
            return (0, level_1.toPublicLevelDTO)(deleted);
        });
    }
    getLevelByXP(xp) {
        return __awaiter(this, void 0, void 0, function* () {
            const level = yield this._levelRepo.getLevelByXP(xp);
            if (!level)
                return null;
            return (0, level_1.toPublicLevelDTO)(level);
        });
    }
    updateUserLevel(userId, gainedXP) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepo.getUserById(userId);
            if (!user)
                throw new Error("User not found");
            const newXP = user.stats.xpPoints + gainedXP;
            let newLevel = user.stats.level;
            const level = yield this.getLevelByXP(newXP);
            if (level) {
                newLevel = level.levelNumber;
            }
            if (newLevel > user.stats.level) {
                yield this._userRepo.updateUserLevel(userId, newLevel);
                const reward = `Congratulations! You've leveled up to level ${newLevel}. Enjoy your reward!`;
                return { levelUpdated: true, reward };
            }
            yield this._userRepo.updateUserXP(userId, newXP);
            return { levelUpdated: false };
        });
    }
}
exports.LevelService = LevelService;
