import { UpdateQuery } from "mongoose";
import { MarketItemDocument } from "@shared/types";
import { MarketItemFilter, MongoSortOptions } from "@shared/types";

export interface IMarketRepository {
  createItem(data: Partial<MarketItemDocument>): Promise<MarketItemDocument>;
  getAllItems(query: MarketItemFilter, sort: MongoSortOptions, skip: number, limit: number): Promise<MarketItemDocument[]>;
  countMarketItems(query: MarketItemFilter): Promise<number>;
  getItemById(id: string): Promise<MarketItemDocument | null>;
  updateItem(id: string, update: UpdateQuery<MarketItemDocument>): Promise<MarketItemDocument | null>;
  deleteItem(id: string): Promise<boolean>;
}
