import { BaseDto } from "@shared/dtos/base.dto";

export class CommentSolutionRequestDto extends BaseDto {
  solutionId!: string;
  content!: string;

  validate() {
    const errors: string[] = [];
    if (!this.solutionId) errors.push("Solution ID is required");
    if (!this.content || this.content.trim().length < 2)
      errors.push("Comment content must be at least 2 characters");
    return { valid: errors.length === 0, errors };
  }
}
