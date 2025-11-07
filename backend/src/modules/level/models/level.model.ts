import { model, Schema } from "mongoose";
import { LevelIF } from "@shared/types";

const levelRewardSchema = new Schema(
  {
    refType: {
      type: String,
      enum: ['Avatar', 'Banner' ,'Badge'], 
    },
    rewardId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'refType', 
    },
    type: { type: String, enum: ['avatar', 'banner', 'badge'], required: true },
    name: { type: String, required: true },
    rewardDescription: { type: String, required: true },
  },
  { _id: false }
);


const levelSchema = new Schema<LevelIF>(
  {
    levelNumber: { type: Number, required: true, unique: true },
    requiredXP: { type: Number, required: true },
    rewards: { type: [levelRewardSchema], required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const LevelModel = model<LevelIF>("Level", levelSchema);


