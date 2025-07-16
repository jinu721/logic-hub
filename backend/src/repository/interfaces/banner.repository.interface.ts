import { UpdateQuery } from "mongoose";
import { InventoryIF } from "../../types/inventory.types";

export interface IBannerRepository {
  createBanner(data: Partial<InventoryIF>): Promise<InventoryIF>;
  getAllBanners(query:any,skip:number,limit:number): Promise<InventoryIF[]>;
  getBannerById(id: string): Promise<InventoryIF | null>;
  updateBanner(userId: string, update: UpdateQuery<InventoryIF>): Promise<InventoryIF | null>
  deleteBanner(id: string): Promise<boolean>;
}
