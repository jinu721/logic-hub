import { IPublicInventoryDTO } from "../../mappers/inventory.dto";
import { InventoryIF } from "../../shared/types/inventory.types";

export interface IAvatarService {
  createAvatar(data: Partial<InventoryIF>): Promise<IPublicInventoryDTO>;
  getAllAvatars(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]>;
  getAvatarById(id: string): Promise<IPublicInventoryDTO | null>;
  updateAvatar(id: string, data: Partial<IPublicInventoryDTO>): Promise<IPublicInventoryDTO | null>;
  deleteAvatar(id: string): Promise<boolean>;
}
