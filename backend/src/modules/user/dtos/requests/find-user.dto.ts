import { BaseDto } from "@shared/dtos/base.dto";

export class FindUserRequestDto extends BaseDto {
  value!: string;

  validate() {
    const errors: string[] = [];
    if (!this.value) errors.push("value is required");
    return { valid: errors.length === 0, errors };
  }
}
