import { BadgesModel, IBadgeRepository } from "@modules/inventory"
import { InventoryIF } from "@shared/types"
import { BaseRepository } from "@core"


export class BadgeRepository
  extends BaseRepository<InventoryIF>
  implements IBadgeRepository
{
  constructor() {
    super(BadgesModel);
  }

  async createBadges(data: InventoryIF): Promise<InventoryIF> {
    return await this.model.create(data);
  }

  async getAllBadges(query:any,skip:number,limit:number): Promise<InventoryIF[]> {
    return await this.model.find(query).skip(skip).limit(limit).sort({_id:-1});
  }

  async getBadgeById(id: string): Promise<InventoryIF | null> {
    return await this.model.findById(id);
  }

  async updateBadge(
    id: string,
    data: Partial<InventoryIF>
  ): Promise<InventoryIF | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBadge(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
