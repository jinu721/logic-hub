import { BaseDto } from "@shared/dtos/base.dto";

export class CreateSubmissionRequestDto extends BaseDto {
  challengeId!: string;
  userCode!: string;
  language!: string;

  validate() {
    const errors: string[] = [];
    if (!this.challengeId) errors.push("Challenge ID is required");
    if (!this.userCode) errors.push("User code is required");
    if (!this.language) errors.push("Language is required");
    return { valid: errors.length === 0, errors };
  }
}
