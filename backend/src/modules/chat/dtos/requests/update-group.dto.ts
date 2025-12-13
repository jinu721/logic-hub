import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateGroupDto extends BaseDto {
  groupId!: string;
  payload!: Record<string, any>;

  validate() {
    const errors: string[] = [];
    if (!this.groupId) errors.push("GroupId required");
    if (!this.payload) errors.push("Payload required");
    return { valid: errors.length === 0, errors };
  }
}
