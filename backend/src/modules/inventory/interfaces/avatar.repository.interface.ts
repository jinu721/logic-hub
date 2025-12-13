import { UpdateQuery } from "mongoose";
import { InventoryDocument } from "@shared/types";

export interface IAvatarRepository {
  create(data: Partial<InventoryDocument>): Promise<InventoryDocument>;
  getAll(query:any,skip:number,limit:number): Promise<InventoryDocument[]>;
  getById(id: string): Promise<InventoryDocument | null>;
  update(userId: string, update: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null>
  delete(id: string): Promise<boolean>;
}
