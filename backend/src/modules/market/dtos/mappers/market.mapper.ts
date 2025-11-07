import { MarketItemIF } from "@shared/types";
import { toPublicInventoryDTO } from "@modules/inventory";
import { PublicMarketItemDTO } from "@modules/market/dtos";

export const toPublicMarketItemDTO = (item: MarketItemIF): PublicMarketItemDTO => {
  return {
    _id: item._id ? item._id.toString() : "",
    name: item.name,
    description: item.description,
    costXP: item.costXP,
    itemId: toPublicInventoryDTO(item.itemId as any) as any,
    category: item.category,
    available: item.available,
    limitedTime: item.limitedTime,
    isExclusive: item.isExclusive,
    expiresAt: item.expiresAt,
    createdAt: item.createdAt,
  };
};

export const toPublicMarketItemDTOs = (items: MarketItemIF[]): PublicMarketItemDTO[] => {
  return items.map(toPublicMarketItemDTO);
};
