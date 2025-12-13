import mongoose, { Schema } from "mongoose";
import { InventoryDocument } from "@shared/types";

const BannerSchema: Schema<InventoryDocument> = new Schema(
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

export const BannerModel = mongoose.model<InventoryDocument>("Banner", BannerSchema);
