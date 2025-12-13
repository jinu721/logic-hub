import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateChallengeDto extends BaseDto {
  challengeId!: string;
  payload!: Record<string, any>;

  validate() {
    const errors: string[] = [];
    if (!this.challengeId) errors.push("Challenge ID is required");
    if (!this.payload || typeof this.payload !== "object")
      errors.push("Update payload must be an object");
    return { valid: errors.length === 0, errors };
  }
}
