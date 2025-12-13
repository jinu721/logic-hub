import { InventoryDocument } from "@shared/types";

export interface IInventoryService {
  create(data: InventoryDocument): Promise<any>;
  getAll(search: string, page: number, limit: number): Promise<any[]>;
  getById(id: string): Promise<any|null>;
  update(id: string, data: Partial<InventoryDocument>): Promise<any|null>;
  delete(id: string): Promise<boolean>;
}
