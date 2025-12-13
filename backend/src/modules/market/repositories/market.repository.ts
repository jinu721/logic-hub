import { UpdateQuery } from "mongoose";
import { MarketModel, IMarketRepository } from "@modules/market";
import { MarketItemDocument, MarketItemFilter, MongoSortOptions } from "@shared/types";
import { BaseRepository } from "@core";

export class MarketRepository
  extends BaseRepository<MarketItemDocument>
  implements IMarketRepository {
  constructor() {
    super(MarketModel);
  }

  async createItem(data: Partial<MarketItemDocument>): Promise<MarketItemDocument> {
    return await this.model.create(data);
  }

  async getAllItems(query: MarketItemFilter, sort: MongoSortOptions, skip: number, limit: number): Promise<MarketItemDocument[]> {
    return await this.model.find(query).sort({ createdAt: -1, ...sort }).skip(skip).limit(limit).populate("itemId");
  }

  async countMarketItems(query: MarketItemFilter): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async getItemById(id: string): Promise<MarketItemDocument | null> {
    return await this.model.findById(id);
  }

  async updateItem(id: string, update: UpdateQuery<MarketItemDocument>): Promise<MarketItemDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
