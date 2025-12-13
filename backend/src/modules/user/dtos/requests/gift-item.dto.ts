import { BaseDto } from "@shared/dtos/base.dto";

export class GiftItemRequestDto extends BaseDto {
  itemId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.itemId) errors.push("itemId is required");
    return { valid: errors.length === 0, errors };
  }
}
