import { InventoryIF } from "./inventory.types";

export interface MarketItemIF {
  _id?: string;
  name: string;
  description?: string;
  costXP: number;
  itemId: InventoryIF;
  itemType: string;
  category: "avatar" | "banner" | "badge" | string;
  available?: boolean;
  limitedTime?: boolean;
  isExclusive?: boolean;
  expiresAt?: Date | string;
  createdAt?: Date | string;
}
