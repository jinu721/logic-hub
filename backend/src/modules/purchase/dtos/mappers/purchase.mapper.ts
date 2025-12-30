import { PurchaseDocument } from "@shared/types";
import { PublicPurchaseDTO } from "@modules/purchase/dtos";

export const toPublicPurchaseDTO = (purchase: PurchaseDocument): PublicPurchaseDTO => {
  return {
    _id: purchase._id ? purchase._id.toString() : "",
    userId: purchase.userId.toString(),
    planId: purchase.planId.toString(),
    razorpayOrderId: purchase.razorpayOrderId,
    razorpayPaymentId: purchase.razorpayPaymentId,
    razorpaySignature: purchase.razorpaySignature,
    amount: purchase.amount,
    status: purchase.status,
    startedAt: purchase.startedAt,
    expiresAt: purchase.expiresAt,
  };
};

export const toPublicPurchaseDTOs = (purchases: PurchaseDocument[]): PublicPurchaseDTO[] => {
  return purchases.map(toPublicPurchaseDTO);
};
