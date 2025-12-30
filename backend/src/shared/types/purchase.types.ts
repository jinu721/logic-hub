import { Document, Types } from "mongoose";

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

export interface PurchaseDocument extends PurchaseAttrs, Document{}

// Legacy interface name for backward compatibility
export interface PurchaseIF extends PurchaseDocument {}