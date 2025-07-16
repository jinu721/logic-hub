import { Document } from "mongoose";

export interface DiscountIF {
    active: boolean;
    amount: string;
    type: "percentage" | "fixed";
    validUntil: string;
  }
  
  export interface MembershipIF extends Document {
    name: string;
    price: string;
    description: string;
    type: "silver" | "gold";
    isActive: boolean;
    isFeatured: boolean;
    features: string[];
    discount: DiscountIF;
  }