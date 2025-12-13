import { BaseDto } from "@shared/dtos/base.dto";

export class CreateInventoryDto extends BaseDto {
  name!: string;
  description!: string;
  isActive!: boolean;
  rarity!: string;
  image?: string;

  validate() {
    const errors: string[] = [];
    if (!this.name) errors.push("Name is required");
    if (!this.description) errors.push("Description is required");
    if (this.isActive === undefined || this.isActive === null) errors.push("isActive is required");
    if (!this.rarity) errors.push("Rarity is required");
    return { valid: errors.length === 0, errors };
  }
}
