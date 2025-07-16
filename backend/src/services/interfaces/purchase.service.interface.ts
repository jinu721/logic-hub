import { PublicPurchaseDTO } from "../../mappers/purchase.dto";
import { PurchaseIF } from "../../types/purchase.types";

export interface IPurchaseService {
  createPlanPurchase(data: PurchaseIF): Promise<PublicPurchaseDTO>;
  getUserPurchases(userId: string): Promise<PublicPurchaseDTO[] | null>;
  getPlanHistoryById(id: string): Promise<PublicPurchaseDTO | null>;
  getPlanHistory(page:number,limit:number): Promise<{purchases:PublicPurchaseDTO[],totalItems:number}>;
}
