import { LevelDocument, LevelReward } from "@shared/types";
import { PublicLevelDTO } from "@modules/level";

export const toPublicLevelDTO = (level: LevelDocument): PublicLevelDTO => {
  return {
    _id: level._id ? level._id.toString() : "",
    levelNumber: level.levelNumber,
    requiredXP: level.requiredXP,
    description: level.description,
    rewards: level.rewards.map((reward: LevelReward) => ({
      type: reward.type,
      name: reward.name,
      rewardId: reward.rewardId.toString(),
      rewardDescription: reward.rewardDescription,
    })),
    createdAt: level.createdAt,
    updatedAt: level.updatedAt,
  };
};

export const toPublicLevelDTOs = (levels: LevelDocument[]): PublicLevelDTO[] => {
  return levels.map(toPublicLevelDTO);
};
