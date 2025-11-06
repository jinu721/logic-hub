import mongoose, { Model, Schema } from 'mongoose';
import { IMembershipPurchase } from '../shared/types/purchase.types';



const MembershipPurchaseSchema: Schema<IMembershipPurchase> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'PremiumPlan', required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
    amount:{type:Number},
    status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },

    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const MembershipPurchase: Model<IMembershipPurchase> = mongoose.model<IMembershipPurchase>(
  'Purchases',
  MembershipPurchaseSchema
);
