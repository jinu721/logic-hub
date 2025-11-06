import { Document } from "mongoose";

export interface InventoryIF extends Document {
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  }
  