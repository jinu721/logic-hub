import { UpdateQuery } from "mongoose"
import { AvatarModel, IAvatarRepository } from "@modules/inventory"
import { InventoryDocument } from "@shared/types"
import { BaseRepository } from "@core"


export class AvatarRepository
  extends BaseRepository<InventoryDocument>
  implements IAvatarRepository
{
  constructor() {
    super(AvatarModel);
  }

  async create(data: InventoryDocument): Promise<InventoryDocument> {
    return await this.model.create(data);
  }

  async getAll(query:any,skip:number,limit:number): Promise<InventoryDocument[]> {
    return await this.model.find(query).skip(skip).limit(limit).sort({_id:-1});
  }

  async getById(id: string): Promise<InventoryDocument | null> {
    return await this.model.findById(id);
  }

  async update(userId: string, update: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null> {
    return await this.model.findByIdAndUpdate(userId, update, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
