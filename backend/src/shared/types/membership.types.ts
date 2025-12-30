
import { Document } from "mongoose";

export interface DiscountIF {
    active: boolean;
    amount: string;
    type: "percentage" | "fixed";
    validUntil: string;
  }
  
  export interface MembershipAttrs {
    name: string;
    price: string;
    description: string;
    type: "silver" | "gold";
    isActive: boolean;
    isFeatured: boolean;
    features: string[];
    discount: DiscountIF;
  }

  export interface MembershipDocument extends MembershipAttrs, Document {}

  // Legacy interface name for backward compatibility
  export interface MembershipIF extends MembershipDocument {}