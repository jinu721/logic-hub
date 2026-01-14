import { MarketItemDocument, PopulatedInventory } from "@shared/types";
import { toPublicInventoryDTO, IPublicInventoryDTO } from "@modules/inventory";
import { PublicMarketItemDTO } from "@modules/market/dtos";

export const toPublicMarketItemDTO = (item: MarketItemDocument): PublicMarketItemDTO => {
  const isPopulated = (obj: any): obj is PopulatedInventory => {
    return obj && typeof obj === 'object' && ('name' in obj || obj instanceof Object && obj.constructor.name !== 'ObjectId');
  };

  return {
    _id: item._id ? item._id.toString() : "",
    name: item.name,
    description: item.description,
    costXP: item.costXP,
    itemId: isPopulated(item.itemId) ? (toPublicInventoryDTO(item.itemId) || {
      _id: "",
      name: "Unknown Item",
      description: "",
      image: "",
      isActive: false,
      rarity: "common"
    } as IPublicInventoryDTO) : {
      _id: item.itemId ? item.itemId.toString() : "",
      name: "Unpopulated Item",
      description: "This item's details could not be loaded.",
      image: "",
      isActive: false,
      rarity: "common"
    } as IPublicInventoryDTO,
    category: item.category,
    available: item.available,
    limitedTime: item.limitedTime,
    isExclusive: item.isExclusive,
    expiresAt: item.expiresAt,
    createdAt: item.createdAt,
  };
};

export const toPublicMarketItemDTOs = (items: MarketItemDocument[]): PublicMarketItemDTO[] => {
  return items.map(toPublicMarketItemDTO);
};
