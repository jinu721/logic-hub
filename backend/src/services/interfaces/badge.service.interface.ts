import { IPublicInventoryDTO } from "../../mappers/inventory.dto";
import { InventoryIF } from "../../types/inventory.types";

export interface IBadgeService {
  createBadge(data: Partial<InventoryIF>): Promise<IPublicInventoryDTO>;
  getAllBadges(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]>;
  getBadgeById(id: string): Promise<IPublicInventoryDTO | null>;
  updateBadge(id: string, data: Partial<IPublicInventoryDTO>): Promise<IPublicInventoryDTO | null>;
  deleteBadge(id: string): Promise<boolean>;
}
