import mongoose, { Schema } from "mongoose";
import { InventoryDocument } from "@shared/types";

const AvatarSchema: Schema<InventoryDocument> = new Schema(
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

export const AvatarModel = mongoose.model<InventoryDocument>("Avatar", AvatarSchema);
