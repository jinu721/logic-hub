export interface IPublicInventoryDTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}
