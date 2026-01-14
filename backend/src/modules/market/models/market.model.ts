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

marketItemSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function () {
});

marketItemSchema.post('init', function (doc) {
  if (!doc.itemModel && doc.category) {
    const map: any = {
      'avatar': 'Avatar',
      'banner': 'Banner',
      'badge': 'Badge'
    };
    doc.itemModel = map[doc.category] || 'Avatar';
  }
});

marketItemSchema.pre('save', function (next) {
  if (!this.itemModel && this.category) {
    const map: any = {
      'avatar': 'Avatar',
      'banner': 'Banner',
      'badge': 'Badge'
    };
    this.itemModel = map[this.category] || 'Avatar';
  }
  next();
});

export const MarketModel = model<MarketItemDocument>('MarketItem', marketItemSchema);
