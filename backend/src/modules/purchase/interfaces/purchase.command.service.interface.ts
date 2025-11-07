import { PurchaseIF } from "@shared/types";
import { PublicPurchaseDTO } from "@modules/purchase/dtos";

export interface IPurchaseCommandService {
  createPlanPurchase(data: Partial<PurchaseIF>): Promise<PublicPurchaseDTO>;
}
