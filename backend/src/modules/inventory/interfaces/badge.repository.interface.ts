import { UpdateQuery } from "mongoose";
import { InventoryIF } from "@shared/types";

export interface IBadgeRepository {
  createBadges(data: Partial<InventoryIF>): Promise<InventoryIF>;
  getAllBadges(query:any,skip:number,limit:number): Promise<InventoryIF[]>;
  getBadgeById(id: string): Promise<InventoryIF | null>;
  updateBadge(userId: string, update: UpdateQuery<InventoryIF>): Promise<InventoryIF | null>
  deleteBadge(id: string): Promise<boolean>;
}
