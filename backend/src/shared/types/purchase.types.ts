import { Types } from "mongoose";

export interface PurchaseAttrs {
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