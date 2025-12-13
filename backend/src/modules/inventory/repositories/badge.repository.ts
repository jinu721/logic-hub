import { BadgesModel, IBadgeRepository } from "@modules/inventory"
import { InventoryDocument } from "@shared/types"
import { BaseRepository } from "@core"


export class BadgeRepository
  extends BaseRepository<InventoryDocument>
  implements IBadgeRepository
{
  constructor() {
    super(BadgesModel);
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

  async update(
    id: string,
    data: Partial<InventoryDocument>
  ): Promise<InventoryDocument | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
