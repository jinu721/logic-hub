import { BannerModel } from "../../models/banner.model";
import { InventoryIF } from "../../types/inventory.types";
import { BaseRepository } from "../base.repository";
import { IBannerRepository } from "../interfaces/banner.repository.interface";

export class BannerRepository
  extends BaseRepository<InventoryIF>
  implements IBannerRepository
{
  constructor() {
    super(BannerModel);
  }

  async createBanner(data: InventoryIF): Promise<InventoryIF> {
    return await this.model.create(data);
  }

  async getAllBanners(query:any,skip:number,limit:number): Promise<InventoryIF[]> {
    return await this.model.find(query).skip(skip).limit(limit).sort({_id:-1});
  }

  async getBannerById(id: string): Promise<InventoryIF | null> {
    return await this.model.findById(id);
  }

  async updateBanner(
    id: string,
    data: Partial<InventoryIF>
  ): Promise<InventoryIF | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBanner(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
