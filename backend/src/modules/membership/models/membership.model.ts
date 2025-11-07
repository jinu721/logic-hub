import mongoose, { Schema, Document, Model } from "mongoose";
import { MembershipIF } from "@shared/types";



export interface PremiumPlanDocument extends MembershipIF, Document {}

const DiscountSchema: Schema = new Schema(
  {
    active: { type: Boolean, required: true, default: false },
    amount: { type: String },
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    validUntil: { type: String },
  },
  { _id: false } 
);

const PremiumPlanSchema: Schema<PremiumPlanDocument> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["silver", "gold"], default: "silver" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    features: [{ type: String }],
    discount: { type: DiscountSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const MembershipModel: Model<PremiumPlanDocument> = mongoose.model<PremiumPlanDocument>("PremiumPlan",PremiumPlanSchema);
