import { BaseDto } from "@shared/dtos/base.dto";

export class DeleteSubmissionDto extends BaseDto {
  id!: string;

  validate() {
    const errors: string[] = [];
    if (!this.id) errors.push("Submission ID required");
    return { valid: errors.length === 0, errors };
  }
}
