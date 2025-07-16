
export interface DiscountIF {
    active: boolean;
    amount: number;
    type: "percentage" | "fixed";
    validUntil: string;
  }
  
  export interface MembershipPlanIF {
    _id?: string;
    name: string;
    price: number;
    description: string;
    type: "silver" | "gold";
    isActive: boolean;
    isFeatured: boolean;
    features: string[];
    discount: DiscountIF;
  }