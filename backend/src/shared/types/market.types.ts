import { Types, Document } from "mongoose";

export interface MarketItemAttrs {
  name: string;
  description?: string;
  costXP: number;
  itemId: Types.ObjectId;
  itemModel: 'Avatar' | 'Banner' | 'Badge';
  category: 'avatar' | 'banner' | 'badge';
  available?: boolean;
  limitedTime?: boolean;
  isExclusive?: boolean;
  expiresAt?: Date;
  createdAt?: Date;
}

export interface MarketItemDocument extends MarketItemAttrs, Document { }
