"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionUserQueryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SolutionUserQueryDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("User ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SolutionUserQueryDto = SolutionUserQueryDto;
