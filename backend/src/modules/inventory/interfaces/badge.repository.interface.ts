import { UpdateQuery } from "mongoose";
import { InventoryIF } from "@shared/types";

export interface IBadgeRepository {
  create(data: Partial<InventoryIF>): Promise<InventoryIF>;
  getAll(query:any,skip:number,limit:number): Promise<InventoryIF[]>;
  getById(id: string): Promise<InventoryIF | null>;
  update(userId: string, update: UpdateQuery<InventoryIF>): Promise<InventoryIF | null>
  delete(id: string): Promise<boolean>;
}
