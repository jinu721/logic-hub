// file: update-solution.dto.ts
import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateSolutionDto extends BaseDto {
  solutionId!: string;
  payload!: Record<string, any>;

  validate() {
    const errors: string[] = [];
    if (!this.solutionId) errors.push("Solution ID required");
    if (!this.payload || typeof this.payload !== "object")
      errors.push("Update payload must be an object");
    return { valid: errors.length === 0, errors };
  }
}
