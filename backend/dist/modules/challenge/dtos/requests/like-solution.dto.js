"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeSolutionDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class LikeSolutionDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.solutionId)
            errors.push("Solution ID required");
        if (!this.userId)
            errors.push("User ID required");
        return { valid: errors.length === 0, errors };
    }
}
exports.LikeSolutionDto = LikeSolutionDto;
