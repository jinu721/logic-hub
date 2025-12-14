import { BaseDto } from "@shared/dtos/base.dto";
import { UpdateSubmissionPayload } from "@shared/types";

export class UpdateSubmissionDto extends BaseDto {
  id!: string;
  payload!: UpdateSubmissionPayload;

  validate() {
    const errors: string[] = [];
    if (!this.id) errors.push("Submission ID required");
    if (!this.payload || typeof this.payload !== "object")
      errors.push("Update payload must be an object");
    return { valid: errors.length === 0, errors };
  }
}
