"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubmissionDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateSubmissionDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("Submission ID required");
        if (!this.payload || typeof this.payload !== "object")
            errors.push("Update payload must be an object");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateSubmissionDto = UpdateSubmissionDto;
