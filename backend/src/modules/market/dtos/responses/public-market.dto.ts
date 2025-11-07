import { IPublicInventoryDTO } from "@modules/inventory";

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
