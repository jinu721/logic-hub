import { BaseDto } from "@shared/dtos/base.dto";

export class GroupUserDto extends BaseDto {
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("UserId required");
    return { valid: errors.length === 0, errors };
  }
}
