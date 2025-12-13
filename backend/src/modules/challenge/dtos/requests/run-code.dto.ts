import { BaseDto } from "@shared/dtos/base.dto";

export class RunCodeRequestDto extends BaseDto {
  challengeId!: string;
  language!: string;
  sourceCode!: string;
  input!: string;

  validate() {
    const errors: string[] = [];
    if (!this.language) errors.push("Language is required");
    if (!this.sourceCode) errors.push("No source code provided");
    if (!this.challengeId) errors.push("Challenge ID missing");
    return { valid: errors.length === 0, errors };
  }
}
