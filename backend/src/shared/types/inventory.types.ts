import { Document, Types } from "mongoose";

export interface InventoryBase {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface PopulatedInventory extends InventoryBase {
  _id: Types.ObjectId;
}

export interface InventoryDocument extends InventoryBase, Document { }

// Legacy interface name for backward compatibility
export interface InventoryAttrs extends InventoryBase { }


export interface InventoryQueryFilter {
    name?: string | { $regex: string; $options: string };
    description?: string;
    image?: string;
    isActive?: boolean;
    rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
}