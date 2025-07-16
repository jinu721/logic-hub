import { UpdateQuery } from "mongoose";
import { InventoryIF } from "../../types/inventory.types";

export interface IAvatarRepository {
  createAvatar(data: Partial<InventoryIF>): Promise<InventoryIF>;
  getAllAvatars(query:any,skip:number,limit:number): Promise<InventoryIF[]>;
  getAvatarById(id: string): Promise<InventoryIF | null>;
  updateAvatar(userId: string, update: UpdateQuery<InventoryIF>): Promise<InventoryIF | null>
  deleteAvatar(id: string): Promise<boolean>;
}
