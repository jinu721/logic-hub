import { Document } from "mongoose";

export interface InventoryAttrs {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface InventoryDocument extends InventoryAttrs, Document { }
