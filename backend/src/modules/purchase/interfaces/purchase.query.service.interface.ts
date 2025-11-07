import { PublicPurchaseDTO } from '@modules/purchase/dtos';

export interface IPurchaseQueryService {
  getUserPurchases(userId: string): Promise<PublicPurchaseDTO[]>;
  getPlanHistoryById(id: string): Promise<PublicPurchaseDTO>;
  getPlanHistory(page: number, limit: number): Promise<{
    items: PublicPurchaseDTO[];
    totalItems: number;
  }>;
}
