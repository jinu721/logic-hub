import { UpdateQuery } from "mongoose";
import { MarketItemIF } from "../../types/market.types";

export interface IMarketRepository {
  createItem(data: Partial<MarketItemIF>): Promise<MarketItemIF>;
  getAllItems(query: any,sort:any,skip:number,limit:number): Promise<MarketItemIF[]>;
  countMarketItems(query: any): Promise<number>;
  getItemById(id: string): Promise<MarketItemIF | null>;
  updateItem(id: string, update: UpdateQuery<MarketItemIF>): Promise<MarketItemIF | null>;
  deleteItem(id: string): Promise<boolean>;
}
