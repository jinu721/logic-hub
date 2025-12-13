import { BaseDto } from "@shared/dtos/base.dto";

export class SendMessageDto extends BaseDto {
  conversationId!: string;
  content?: string;
  type!: string;
  replyTo?: string;
  mentionedUsers?: string[];
  media?: {
    url: string;
    type: string;
  };

  validate() {
    const e: string[] = [];
    if (!this.conversationId) e.push("conversationId required");
    if (!this.type) e.push("message type required");
    return { valid: e.length === 0, errors: e };
  }
}
