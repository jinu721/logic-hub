import { UpdateQuery } from "mongoose";
import { MarketItem } from "../../models/market.model";
import { MarketItemIF } from "../../shared/types/market.types";
import { BaseRepository } from "../../shared/core/base.repository";
import { IMarketRepository } from "../interfaces/market.repository.interface";

export class MarketRepository
  extends BaseRepository<MarketItemIF>
  implements IMarketRepository
{
  constructor() {
    super(MarketItem);
  }

  async createItem(data: Partial<MarketItemIF>): Promise<MarketItemIF> {
    return await this.model.create(data);
  }

  async getAllItems(query: any, sort: any,skip:number,limit:number): Promise<MarketItemIF[]> {
    return await this.model.find(query).sort({ createdAt: -1 , ...sort}).skip(skip).limit(limit).populate("itemId");
  }

  async countMarketItems(query: any): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async getItemById(id: string): Promise<MarketItemIF | null> {
    return await this.model.findById(id);
  }

  async updateItem(id: string, update: UpdateQuery<MarketItemIF>): Promise<MarketItemIF | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
