import { BaseDto } from "@shared/dtos/base.dto";

export class FindConversationDto extends BaseDto {
  conversationId!: string;
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.conversationId) errors.push("Conversation ID is required");
    if (!this.userId) errors.push("User ID is required");
    return { valid: errors.length === 0, errors };
  }
}
