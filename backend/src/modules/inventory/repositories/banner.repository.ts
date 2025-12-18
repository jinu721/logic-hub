import { UpdateQuery } from "mongoose"
import { BannerModel, IBannerRepository } from "@modules/inventory"
import { InventoryDocument, InventoryQueryFilter, PopulatedInventory } from "@shared/types"


export class BannerRepository implements IBannerRepository {
  constructor() {
  }

  async create(data: Partial<InventoryDocument>): Promise<InventoryDocument> {
    return await BannerModel.create(data);
  }

  async getAll(query: InventoryQueryFilter, skip: number, limit: number): Promise<PopulatedInventory[]> {
    return await BannerModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean<PopulatedInventory[]>();
  }

  async getById(id: string): Promise<PopulatedInventory | null> {
    return await BannerModel.findById(id).lean<PopulatedInventory>();
  }

  async update(id: string, data: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null> {
    return await BannerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await BannerModel.findByIdAndDelete(id);
    return !!result;
  }
}
