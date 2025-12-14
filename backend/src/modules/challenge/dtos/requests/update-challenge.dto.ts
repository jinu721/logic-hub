import { BaseDto } from "@shared/dtos/base.dto";
import { TestCaseIF, UpdateChallengePayload } from "@shared/types";

export class UpdateChallengeDto extends BaseDto {
  challengeId!: string;
  payload!: UpdateChallengePayload;

  validate() {
    const errors: string[] = [];
    if (!this.challengeId) errors.push("Challenge ID is required");
    if (!this.payload.title) errors.push("Title is required");
    if (!this.payload.instructions) errors.push("Instructions is required");
    if (!this.payload.type) errors.push("Type is required");
    if (!this.payload.level) errors.push("Level is required");
    if (!this.payload.timeLimit) errors.push("Time limit is required");
    if (!this.payload.tags) errors.push("Tags is required");
    if (!this.payload.xpRewards) errors.push("XP rewards is required");
    return { valid: errors.length === 0, errors };
  }
}
