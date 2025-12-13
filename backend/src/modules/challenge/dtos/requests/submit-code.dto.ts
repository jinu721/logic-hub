import { BaseDto } from "@shared/dtos/base.dto";

export class SubmitChallengeDto extends BaseDto {
  challengeId!: string;
  userCode!: string;
  language!: string;

  validate() {
    const errors: string[] = [];
    if (!this.challengeId) errors.push("Invalid challenge ID");
    if (!this.userCode) errors.push("Code is required");
    if (!this.language) errors.push("Language is required");
    return { valid: errors.length === 0, errors };
  }
}
