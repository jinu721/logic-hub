"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSolutionRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CommentSolutionRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.solutionId)
            errors.push("Solution ID is required");
        if (!this.content || this.content.trim().length < 2)
            errors.push("Comment content must be at least 2 characters");
        return { valid: errors.length === 0, errors };
    }
}
exports.CommentSolutionRequestDto = CommentSolutionRequestDto;
