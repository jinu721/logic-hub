import { MarketItemIF } from "../types/market.types";
import { IPublicInventoryDTO, toPublicInventoryDTO } from "./inventory.dto";

export interface PublicMarketItemDTO {
  _id: string;
  name: string;
  description?: string;
  costXP: number;
  itemId: IPublicInventoryDTO;
  category: 'avatar' | 'banner' | 'badge';
  available?: boolean;
  limitedTime?: boolean;
  isExclusive?: boolean;
  expiresAt?: Date;
  createdAt?: Date;
}



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
