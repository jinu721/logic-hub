import { BaseDto } from "@shared/dtos/base.dto";
import { ChallengeLevel, ChallengeType, TestCaseIF } from "@shared/types";

export class CreateChallengeRequestDto extends BaseDto {
  title!: string;
  instructions!: string;
  type!: ChallengeType; 
  level!: ChallengeLevel;
  testCases!: TestCaseIF[];
  timeLimit!: number;
  tags!: string[];
  xpRewards!: number;

  hints?: string[];
  requiredSkills?: string[];
  functionName?: string;
  parameters?: { name: string; type: string }[];
  returnType?: string;
  initialCode?: string | Record<string, string>;
  solutionCode?: string | Record<string, string>;
  isPremium?: boolean;
  isKeyRequired?: boolean;
  status?: "active" | "inactive" | "draft" | "archived";
  startTime?: Date;
  endTime?: Date;

  validate() {
    const errors: string[] = [];

    if (!this.title) errors.push("Title is required");
    if (!this.instructions) errors.push("Instructions are required");
    if (!this.type) errors.push("Challenge type is required");
    if (!this.level) errors.push("Challenge level is required");

    if (!this.testCases || !Array.isArray(this.testCases) || this.testCases.length === 0)
      errors.push("At least one test case is required");

    if (!this.timeLimit || this.timeLimit <= 0)
      errors.push("Time limit must be greater than 0");

    if (!this.tags || !Array.isArray(this.tags) || this.tags.length === 0)
      errors.push("At least one tag is required");

    if (this.xpRewards == null || this.xpRewards < 0)
      errors.push("XP rewards must be a positive number");

    return { valid: errors.length === 0, errors };
  }
}
