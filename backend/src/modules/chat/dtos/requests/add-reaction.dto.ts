import { BaseDto } from "@shared/dtos/base.dto";

export class AddReactionDto extends BaseDto {
  messageId!: string;
  emoji!: string;
  userId!: string;

  validate() {
    const e: string[] = [];
    if (!this.messageId) e.push("messageId required");
    if (!this.emoji) e.push("emoji required");
    if (!this.userId) e.push("userId required");
    return { valid: e.length === 0, errors: e };
  }
}
