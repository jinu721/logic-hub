import { BaseDto } from "@shared/dtos/base.dto";

export class FindConversationGroupDto extends BaseDto {
  groupId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.groupId) errors.push("Group ID is required");
    return { valid: errors.length === 0, errors };
  }
}
