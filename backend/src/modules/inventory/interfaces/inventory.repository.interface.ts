import { UpdateQuery } from "mongoose";
import { InventoryDocument, InventoryQueryFilter, PopulatedInventory } from "@shared/types";

export interface IInventoryRepository {
    create(data: Partial<InventoryDocument>): Promise<InventoryDocument>;
    getAll(query: InventoryQueryFilter, skip: number, limit: number): Promise<PopulatedInventory[]>;
    getById(id: string): Promise<PopulatedInventory | null>;
    update(id: string, update: UpdateQuery<InventoryDocument>): Promise<InventoryDocument | null>;
    delete(id: string): Promise<boolean>;
}
