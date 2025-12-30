import { InventoryDocument, InventoryQueryFilter, InventoryBase } from "@shared/types";
import { IPublicInventoryDTO } from "@modules/inventory/dtos";

export interface IInventoryService {
  create(data: Partial<InventoryDocument>): Promise<IPublicInventoryDTO>;
  getAll(search: string, page: number, limit: number): Promise<IPublicInventoryDTO[]>;
  getById(id: string): Promise<IPublicInventoryDTO|null>;
  update(id: string, data: Partial<InventoryDocument>): Promise<IPublicInventoryDTO|null>;
  delete(id: string): Promise<boolean>;
}
