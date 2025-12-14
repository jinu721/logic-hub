import { PopulatedInventory } from "@shared/types"
import { generateSignedImageUrl } from "@utils/application"
import { IPublicInventoryDTO } from "@modules/inventory/dtos";

export const toPublicInventoryDTO = (item: PopulatedInventory): IPublicInventoryDTO | undefined => {
  if (!item) return;
  return {
    _id: item._id.toString(),
    name: item.name,
    description: item.description,
    image: generateSignedImageUrl(item.image),
    isActive: item.isActive,
    rarity: item.rarity,
  };
};

export const toPublicInventoryDTOs = (items: PopulatedInventory[]): IPublicInventoryDTO[] => {
  return items.map((item) => toPublicInventoryDTO(item)!).filter(Boolean);
};
