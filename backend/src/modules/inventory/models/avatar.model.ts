import mongoose, { Schema } from "mongoose";
import { InventoryIF } from "@shared/types";

const AvatarSchema: Schema<InventoryIF> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    rarity: {
      type: String,
      enum: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
      required: true,
    },
  },
  { timestamps: true }
);

export const AvatarModel = mongoose.model<InventoryIF>("Avatar", AvatarSchema);
