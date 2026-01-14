import { BaseDto } from "@shared/dtos/base.dto";

export class CreateSolutionRequestDto extends BaseDto {
  challenge!: string;
  title!: string;
  content!: string;
  implementations!: {
    language: string;
    codeSnippet: string;
  }[];

  validate() {
    const errors: string[] = [];
    if (!this.challenge) errors.push("Challenge ID is required");
    if (!this.title) errors.push("Solution title is required");
    if (!this.content) errors.push("Solution content is required");
    if (!this.implementations || !Array.isArray(this.implementations) || this.implementations.length === 0) {
      errors.push("At least one implementation is required");
    } else {
      this.implementations.forEach((impl, index) => {
        if (!impl.language) errors.push(`Implementation ${index}: language is required`);
        if (!impl.codeSnippet) errors.push(`Implementation ${index}: codeSnippet is required`);
      });
    }
    return { valid: errors.length === 0, errors };
  }
}
