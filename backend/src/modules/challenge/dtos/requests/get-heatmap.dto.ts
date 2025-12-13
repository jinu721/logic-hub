import { BaseDto } from "@shared/dtos/base.dto";

export class GetHeatmapRequestDto extends BaseDto {
  year?: number;
  userId?: string; 

  validate() {
    const errors: string[] = [];

    if (this.year && (isNaN(this.year) || this.year < 2000 || this.year > 2100)) {
      errors.push("Year must be a valid number between 2000 and 2100");
    }

    return { valid: errors.length === 0, errors };
  }
}
