import { BaseDto } from "@shared/dtos/base.dto";

export class FindConversationsByUserDto extends BaseDto {
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }
}
