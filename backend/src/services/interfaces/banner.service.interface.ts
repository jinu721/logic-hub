import { IPublicInventoryDTO } from "../../mappers/inventory.dto";
import { InventoryIF } from "../../types/inventory.types";

export interface IBannerService {
  createBanner(data: Partial<InventoryIF>): Promise<IPublicInventoryDTO>;
  getAllBanners(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]>;
  getBannerById(id: string): Promise<IPublicInventoryDTO | null>;
  updateBanner(id: string, data: Partial<InventoryIF>): Promise<IPublicInventoryDTO | null>;
  deleteBanner(id: string): Promise<boolean>;
}
