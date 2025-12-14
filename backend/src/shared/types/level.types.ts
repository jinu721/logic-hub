import { Document, Types } from "mongoose";

export interface LevelReward {
  type: string;
  name: string;
  rewardId: Types.ObjectId;
  rewardDescription: string;
}

export interface LevelBase {
  levelNumber: number;
  requiredXP: number;
  rewards: LevelReward[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LevelRaw extends LevelBase {
  _id: Types.ObjectId;
}

export interface LevelDocument extends LevelBase, Document {
  _id: Types.ObjectId;
}
