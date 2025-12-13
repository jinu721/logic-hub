import { BaseDto } from "@shared/dtos/base.dto";

export class DeleteCommentDto extends BaseDto {
  solutionId!: string;
  commentId!: string;

  validate() {
    const errors: string[] = [];
    if (!this.solutionId) errors.push("Solution ID required");
    if (!this.commentId) errors.push("Comment ID required");
    return { valid: errors.length === 0, errors };
  }
}
