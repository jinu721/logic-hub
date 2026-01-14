"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSolutionDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateSolutionDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.solutionId)
            errors.push("Solution ID required");
        if (!this.payload || typeof this.payload !== "object")
            errors.push("Update payload must be an object");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateSolutionDto = UpdateSolutionDto;
