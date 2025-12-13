import { BaseDto } from "@shared/dtos/base.dto";

export class SubmissionsByUserDto extends BaseDto {
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("User ID required");
    return { valid: errors.length === 0, errors };
  }
}
