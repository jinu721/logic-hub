"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicLevelDTOs = exports.toPublicLevelDTO = void 0;
const toPublicLevelDTO = (level) => {
    return {
        _id: level._id ? level._id.toString() : "",
        levelNumber: level.levelNumber,
        requiredXP: level.requiredXP,
        description: level.description,
        rewards: level.rewards.map((reward) => ({
            type: reward.type,
            name: reward.name,
            rewardId: reward.rewardId.toString(),
            rewardDescription: reward.rewardDescription,
        })),
        createdAt: level.createdAt,
        updatedAt: level.updatedAt,
    };
};
exports.toPublicLevelDTO = toPublicLevelDTO;
const toPublicLevelDTOs = (levels) => {
    return levels.map(exports.toPublicLevelDTO);
};
exports.toPublicLevelDTOs = toPublicLevelDTOs;
