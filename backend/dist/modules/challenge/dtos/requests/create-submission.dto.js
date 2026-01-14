"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubmissionRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateSubmissionRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.challengeId)
            errors.push("Challenge ID is required");
        if (!this.userCode)
            errors.push("User code is required");
        if (!this.language)
            errors.push("Language is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateSubmissionRequestDto = CreateSubmissionRequestDto;
