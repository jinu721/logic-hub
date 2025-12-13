import { BaseDto } from "@shared/dtos/base.dto";

export class CreateGroupDto extends BaseDto {
  name!: string;
  description?: string;
  image?: string;
  members?: string[];
  groupType?: string;

  validate() {
    const errors: string[] = [];
    if (!this.name) errors.push("Group name required");
    return { valid: errors.length === 0, errors };
  }
}
