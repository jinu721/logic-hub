import { Document, Types } from "mongoose";

export interface LevelReward {
  type: string;
  name: string;
  rewardId: Types.ObjectId;
  rewardDescription: string;
}

export interface LevelIF extends Document {
  levelNumber: number;
  requiredXP: number;
  rewards: LevelReward[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
