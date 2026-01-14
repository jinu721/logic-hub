import { model, Schema, Types } from "mongoose";
import { MarketItemDocument } from "@shared/types";

const marketItemSchema = new Schema<MarketItemDocument>({
  name: {
    type: String,
    required: true,
  },
  description: String,
  costXP: {
    type: Number,
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel',
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['Avatar', 'Banner', 'Badge']
  },
  category: {
    type: String,
    enum: ['avatar', 'banner', 'badge'],
    required: true
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

export const MarketModel = model<MarketItemDocument>('MarketItem', marketItemSchema);
