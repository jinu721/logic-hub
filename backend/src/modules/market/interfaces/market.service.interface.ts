import { PublicMarketItemDTO } from "@modules/market/dtos";
import { MarketItemIF } from "@shared/types";

export interface IMarketService {
  createItem(data: Partial<MarketItemIF>): Promise<PublicMarketItemDTO>;
  getAllItems(filter?: any,page?:number,limit?:number): Promise<{marketItems:PublicMarketItemDTO[],totalItems:number}>;
  getItemById(id: string): Promise<PublicMarketItemDTO | null>;
  updateItem(id: string, data: Partial<MarketItemIF>): Promise<PublicMarketItemDTO | null>;
  deleteItem(id: string): Promise<boolean>;
}
