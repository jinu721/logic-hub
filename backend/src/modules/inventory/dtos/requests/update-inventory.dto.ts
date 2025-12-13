import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateInventoryDto extends BaseDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  rarity?: string;
  image?: string;

  validate() {
    return { valid: true, errors: [] };
  }
}
