import { UpdateQuery } from "mongoose";
import { AvatarModel } from "../../models/avatar.model";
import { InventoryIF } from "../../types/inventory.types";
import { BaseRepository } from "../base.repository";
import { IAvatarRepository } from "../interfaces/avatar.repository.interface";

export class AvatarRepository
  extends BaseRepository<InventoryIF>
  implements IAvatarRepository
{
  constructor() {
    super(AvatarModel);
  }

  async createAvatar(data: InventoryIF): Promise<InventoryIF> {
    return await this.model.create(data);
  }

  async getAllAvatars(query:any,skip:number,limit:number): Promise<InventoryIF[]> {
    return await this.model.find(query).skip(skip).limit(limit).sort({_id:-1});
  }

  async getAvatarById(id: string): Promise<InventoryIF | null> {
    return await this.model.findById(id);
  }

  async updateAvatar(userId: string, update: UpdateQuery<InventoryIF>): Promise<InventoryIF | null> {
    return await this.model.findByIdAndUpdate(userId, update, { new: true });
  }

  async deleteAvatar(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
