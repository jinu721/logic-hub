"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionIdDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SubmissionIdDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("Submission ID required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SubmissionIdDto = SubmissionIdDto;
