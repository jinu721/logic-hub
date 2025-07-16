import { PublicMarketItemDTO } from "../../mappers/market.dto";
import { MarketItemIF } from "../../types/market.types";

export interface IMarketService {
  createItem(data: Partial<MarketItemIF>): Promise<PublicMarketItemDTO>;
  getAllItems(filter?: any,page?:number,limit?:number): Promise<{marketItems:PublicMarketItemDTO[],totalItems:number}>;
  getItemById(id: string): Promise<PublicMarketItemDTO | null>;
  updateItem(id: string, data: Partial<PublicMarketItemDTO>): Promise<PublicMarketItemDTO | null>;
  deleteItem(id: string): Promise<boolean>;
  purchaseMarketItem(id: string,userId:string): Promise<PublicMarketItemDTO | null>;
}
