import { BaseDto } from "@shared/dtos/base.dto";

export class CreateSolutionRequestDto extends BaseDto {
  challenge!: string;       
  title!: string;           
  content!: string;         
  codeSnippet?: string;     
  language?: string;        

  validate() {
    const errors: string[] = [];
    if (!this.challenge) errors.push("Challenge ID is required");
    if (!this.title) errors.push("Solution title is required");
    if (!this.content) errors.push("Solution content is required");
    if (this.language && typeof this.language !== "string") errors.push("Invalid language");
    return { valid: errors.length === 0, errors };
  }
}
