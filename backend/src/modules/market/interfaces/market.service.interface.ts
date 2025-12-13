import { PublicMarketItemDTO } from "@modules/market/dtos";
import { MarketItemFilter } from "@shared/types";
import { MarketItemDocument } from "@shared/types";

export interface IMarketService {
  createItem(data: Partial<MarketItemDocument>): Promise<PublicMarketItemDTO>;
  getAllItems(filter?: MarketItemFilter, page?: number, limit?: number): Promise<{ marketItems: PublicMarketItemDTO[], totalItems: number }>;
  getItemById(id: string): Promise<PublicMarketItemDTO | null>;
  updateItem(id: string, data: Partial<MarketItemDocument>): Promise<PublicMarketItemDTO | null>;
  deleteItem(id: string): Promise<boolean>;
}
