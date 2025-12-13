import { BaseDto } from "@shared/dtos/base.dto";

export class GetChallengeByIdDto extends BaseDto {
  challengeId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.challengeId) errors.push("Challenge ID is required");
    return { valid: errors.length === 0, errors };
  }
}
