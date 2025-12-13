import { BaseDto } from "@shared/dtos/base.dto";

export class ToggleBanRequestDto extends BaseDto {
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("userId required");
    return { valid: errors.length === 0, errors };
  }
}
