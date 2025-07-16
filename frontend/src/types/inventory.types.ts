
export interface InventoryIF {
    _id?: string;
    name: string;
    description: string;
    image: string ;
    isActive: boolean;
    rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  }
  