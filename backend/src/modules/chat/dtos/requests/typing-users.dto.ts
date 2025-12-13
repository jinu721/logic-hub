import { BaseDto } from "@shared/dtos/base.dto";

export class GetTypingUsersDto extends BaseDto {
  conversationId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.conversationId) errors.push("Conversation ID is required");
    return { valid: errors.length === 0, errors };
  }
}
