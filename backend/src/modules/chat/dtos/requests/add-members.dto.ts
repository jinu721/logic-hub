import { BaseDto } from "@shared/dtos/base.dto";

export class AddMembersDto extends BaseDto {
  groupId!: string;
  memberIds!: string[];

  validate() {
    const errors: string[] = [];
    if (!this.groupId) errors.push("GroupId required");
    if (!this.memberIds || !Array.isArray(this.memberIds)) errors.push("memberIds must be array");
    return { valid: errors.length === 0, errors };
  }
}
