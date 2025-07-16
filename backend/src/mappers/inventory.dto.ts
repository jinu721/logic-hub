import { InventoryIF } from "../types/inventory.types";
import { generateSignedImageUrl } from "../utils/generate.image";

export interface IPublicInventoryDTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export const toPublicInventoryDTO = (item: InventoryIF): IPublicInventoryDTO | undefined => {
  if(!item) return;
  return {
    _id: item._id ? item._id.toString() : "",
    name: item.name,
    description: item.description,
    image: generateSignedImageUrl(item.image),
    isActive: item.isActive,
    rarity: item.rarity,
  };
};

export const toPublicInventoryDTOs = (items: InventoryIF[]): IPublicInventoryDTO[] => {
  return items.map(toPublicInventoryDTO);
};
