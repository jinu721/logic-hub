import { UpdateQuery } from "mongoose"
import { iAvatarRepository } from "@modules/inventory/interfaces/avatar.repository.interface" // wait, fix import naming and path
import { IAvatarRepository } from "@modules/inventory"
import { AvatarModel } from "@modules/inventory/models/avatar.model"
import { InventoryDocument, PopulatedInventory } from "@shared/types"


export class AvatarRepository implements IAvatarRepository {
  constructor() {
  }

  async create(data: Partial<InventoryDocument>): Promise<InventoryDocument> {
    return await AvatarModel.create(data);
  }

  async getAll(query: any, skip: number, limit: number): Promise<PopulatedInventory[]> {
    return await AvatarModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean<PopulatedInventory[]>();
  }

  async getById(id: string): Promise<PopulatedInventory | null> {
    return await AvatarModel.findById(id).lean<PopulatedInventory>();
  }

  async update(id: string, update: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null> {
    return await AvatarModel.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await AvatarModel.findByIdAndDelete(id);
    return !!result;
  }
}
