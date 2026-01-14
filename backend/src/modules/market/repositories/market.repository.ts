import { UpdateQuery, Types } from "mongoose";
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
    const items = await this.model.find(query).sort({ createdAt: -1, ...sort }).skip(skip).limit(limit);

    // Auto-fix missing itemModel for population on legacy data
    items.forEach(item => {
      if (!item.itemModel && item.category) {
        const itemModelMap: Record<string, 'Avatar' | 'Banner' | 'Badge'> = {
          'avatar': 'Avatar',
          'banner': 'Banner',
          'badge': 'Badge'
        };
        item.itemModel = itemModelMap[item.category] || 'Avatar';
      }
    });

    await this.model.populate(items, { path: 'itemId' });

    items.forEach(item => {
      const isPopulated = item.itemId && typeof item.itemId === 'object' && 'name' in (item.itemId as any);
      if (!isPopulated) {
        console.log(`[MarketRepo] Item ${item._id} (${item.name}) itemId STILL NOT populated. itemModel: ${item.itemModel}, category: ${item.category}`);
      }
    });

    return items;
  }

  async countMarketItems(query: MarketItemFilter): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async getItemById(id: string): Promise<MarketItemDocument | null> {
    const item = await this.model.findById(id);
    if (item) {
      if (!item.itemModel && item.category) {
        const itemModelMap: Record<string, 'Avatar' | 'Banner' | 'Badge'> = {
          'avatar': 'Avatar',
          'banner': 'Banner',
          'badge': 'Badge'
        };
        item.itemModel = itemModelMap[item.category] || 'Avatar';
      }
      await item.populate('itemId');
    }
    return item;
  }

  async updateItem(id: string, update: UpdateQuery<MarketItemDocument>): Promise<MarketItemDocument | null> {
    const item = await this.model.findByIdAndUpdate(id, update, { new: true });
    if (item) {
      if (!item.itemModel && item.category) {
        const itemModelMap: Record<string, 'Avatar' | 'Banner' | 'Badge'> = {
          'avatar': 'Avatar',
          'banner': 'Banner',
          'badge': 'Badge'
        };
        item.itemModel = itemModelMap[item.category] || 'Avatar';
      }
      await item.populate('itemId');
    }
    return item;
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
