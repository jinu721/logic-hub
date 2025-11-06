export interface CreateInventoryDTO {
  name: string;
  description: string;
  isActive: boolean;
  rarity: string;
  image?: string | null;
}
