import { BaseDto } from "@shared/dtos/base.dto";

export class DeleteGroupDto extends BaseDto {
  groupId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.groupId) errors.push("GroupId required");
    return { valid: errors.length === 0, errors };
  }
}
