import { LevelIF } from "../types/level.types";

export interface PublicLevelDTO {
  _id: string;
  levelNumber: number;
  requiredXP: number;
  description: string;
  rewards: {
    type: string;
    name: string;
    rewardId: string;
    rewardDescription: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}


export const toPublicLevelDTO = (level: LevelIF): PublicLevelDTO => {
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

export const toPublicLevelDTOs = (levels: LevelIF[]): PublicLevelDTO[] => {
  return levels.map(toPublicLevelDTO);
};
