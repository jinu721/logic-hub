"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommentDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class DeleteCommentDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.solutionId)
            errors.push("Solution ID required");
        if (!this.commentId)
            errors.push("Comment ID required");
        return { valid: errors.length === 0, errors };
    }
}
exports.DeleteCommentDto = DeleteCommentDto;
