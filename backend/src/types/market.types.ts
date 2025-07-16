import { Document, Types } from "mongoose";

export interface MarketItemIF extends Document  {
    name: string;
    description?: string;
    costXP: number;
    itemId: Types.ObjectId;
    category: 'avatar' | 'banner' | 'badge' ;
    available?: boolean;
    limitedTime?: boolean;
    isExclusive?: boolean;
    expiresAt?: Date;
    createdAt?: Date;
  }


  