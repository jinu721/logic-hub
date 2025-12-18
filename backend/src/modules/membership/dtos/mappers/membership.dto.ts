import { MembershipDocument } from "@shared/types";
import { PublicMembershipDTO } from "@modules/membership/dtos";

export const toPublicMembershipDTO = (plan: MembershipDocument): PublicMembershipDTO => {
  return {
    _id: plan._id ? plan._id.toString() : "",
    name: plan.name,
    price: plan.price,
    description: plan.description,
    type: plan.type,
    isActive: plan.isActive,
    isFeatured: plan.isFeatured,
    features: plan.features,  
    discount: {
      active: plan.discount.active,
      amount: plan.discount.amount,
      type: plan.discount.type,
      validUntil: plan.discount.validUntil,
    },
  };
};

export const toPublicMembershipDTOs = (plans: MembershipDocument[]): PublicMembershipDTO[] => {
  return plans.map(toPublicMembershipDTO);
};
