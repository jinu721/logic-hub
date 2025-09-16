import { PublicPurchaseDTO } from "../../mappers/purchase.dto";

export interface IPurchaseService {
  createPlanPurchase(data: {
    userId: string;
    planId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    amount: number;
    status: "Success" | "Failed";
  }): Promise<PublicPurchaseDTO>;
  getUserPurchases(userId: string): Promise<PublicPurchaseDTO[] | null>;
  getPlanHistoryById(id: string): Promise<PublicPurchaseDTO | null>;
  getPlanHistory(
    page: number,
    limit: number
  ): Promise<{ purchases: PublicPurchaseDTO[]; totalItems: number }>;
}
