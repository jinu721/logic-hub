import { BaseDto } from "@shared/dtos/base.dto";

export class AdminMemberDto extends BaseDto {
  conversationId!: string;
  groupId!: string;
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.conversationId) errors.push("conversationId required");
    if (!this.groupId) errors.push("groupId required");
    if (!this.userId) errors.push("userId required");
    return { valid: errors.length === 0, errors };
  }
}
