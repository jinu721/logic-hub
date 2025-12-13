import { BaseDto } from "@shared/dtos/base.dto";

export class SubmissionsUserChallengeDto extends BaseDto {
  userId!: string;
  challengeId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("User ID required");
    if (!this.challengeId) errors.push("Challenge ID required");
    return { valid: errors.length === 0, errors };
  }
}
