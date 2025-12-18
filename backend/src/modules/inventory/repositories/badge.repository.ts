import { UpdateQuery } from "mongoose"
import { BadgesModel, IBadgeRepository } from "@modules/inventory"
import { InventoryDocument, InventoryQueryFilter, PopulatedInventory } from "@shared/types"


export class BadgeRepository implements IBadgeRepository {
  constructor() {
  }

  async create(data: Partial<InventoryDocument>): Promise<InventoryDocument> {
    return await BadgesModel.create(data);
  }

  async getAll(query: InventoryQueryFilter, skip: number, limit: number): Promise<PopulatedInventory[]> {
    return await BadgesModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean<PopulatedInventory[]>();
  }

  async getById(id: string): Promise<PopulatedInventory | null> {
    return await BadgesModel.findById(id).lean<PopulatedInventory>();
  }

  async update(id: string, data: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null> {
    return await BadgesModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await BadgesModel.findByIdAndDelete(id);
    return !!result;
  }
}
