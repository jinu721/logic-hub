import { PublicDiscountDTO } from "@modules/membership/dtos";

export interface PublicMembershipDTO {
  _id: string;
  name: string;
  price: string;
  description: string;
  type: "silver" | "gold";
  isActive: boolean;
  isFeatured: boolean;
  features: string[];
  discount: PublicDiscountDTO;
}
