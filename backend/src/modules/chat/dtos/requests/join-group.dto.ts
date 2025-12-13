import { BaseDto } from "@shared/dtos/base.dto";

export class JoinGroupDto extends BaseDto {
  groupId!: string;
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.groupId) errors.push("GroupId required");
    if (!this.userId) errors.push("UserId required");
    return { valid: errors.length === 0, errors };
  }
}
