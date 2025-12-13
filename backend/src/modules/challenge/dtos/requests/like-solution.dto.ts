import { BaseDto } from "@shared/dtos/base.dto";

export class LikeSolutionDto extends BaseDto {
  solutionId!: string;
  userId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.solutionId) errors.push("Solution ID required");
    if (!this.userId) errors.push("User ID required");
    return { valid: errors.length === 0, errors };
  }
}
