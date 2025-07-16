import { PurchaseIF } from "../types/purchase.types";

export interface PublicPurchaseDTO {
  _id: string;
  userId: string;
  planId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  status: 'Success' | 'Failed';
  startedAt: Date;
  expiresAt: Date;
}



export const toPublicPurchaseDTO = (purchase: PurchaseIF): PublicPurchaseDTO => {
  return {
    _id: purchase._id ? purchase._id.toString() : "",
    userId: purchase.userId as any,
    planId: purchase.planId as any,
    razorpayOrderId: purchase.razorpayOrderId,
    razorpayPaymentId: purchase.razorpayPaymentId,
    razorpaySignature: purchase.razorpaySignature,
    amount: purchase.amount,
    status: purchase.status,
    startedAt: purchase.startedAt,
    expiresAt: purchase.expiresAt,
  };
};

export const toPublicPurchaseDTOs = (purchases: PurchaseIF[]): PublicPurchaseDTO[] => {
  return purchases.map(toPublicPurchaseDTO);
};
