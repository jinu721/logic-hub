import { Types,Document } from "mongoose";

export interface PurchaseIF extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  status: 'Success' | 'Failed';
  startedAt: Date;
  expiresAt: Date;
}