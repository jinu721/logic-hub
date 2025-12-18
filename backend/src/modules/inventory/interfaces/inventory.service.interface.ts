import { InventoryDocument, InventoryQueryFilter } from "@shared/types";

export interface IInventoryService {
  create(data: InventoryDocument): Promise<InventoryDocument>;
  getAll(filter: InventoryQueryFilter, page: number, limit: number): Promise<InventoryDocument[]>;
  getById(id: string): Promise<InventoryDocument|null>;
  update(id: string, data: Partial<InventoryDocument>): Promise<InventoryDocument|null>;
  delete(id: string): Promise<boolean>;
}
