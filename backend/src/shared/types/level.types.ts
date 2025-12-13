import { Types } from "mongoose";

export interface LevelReward {
  type: string;
  name: string;
  rewardId: Types.ObjectId;
  rewardDescription: string;
}

export interface LevelAttrs {
  levelNumber: number;
  requiredXP: number;
  rewards: LevelReward[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface LevelDocument extends LevelAttrs, Document {}
