import { model, Schema, Types } from "mongoose";
import { MarketItemIF } from "../shared/types/market.types";

const marketItemSchema = new Schema<MarketItemIF>({
  name: {
    type: String,
    required: true,
  },
  description: String,
  costXP: {
    type: Number,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['Avatar', 'Banner','Badges'], 
  },
  itemId: {
    type: Types.ObjectId,
    required: true,
    refPath: 'itemType', 
  },
  category: {
    type: String,
    enum: ['avatar', 'banner', 'badge'],
    required:true
  },
  available: {
    type: Boolean,
    default: true,
  },
  limitedTime: {
    type: Boolean,
    default: false,
  },
  isExclusive: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MarketItem =  model<MarketItemIF>('MarketItem', marketItemSchema);
