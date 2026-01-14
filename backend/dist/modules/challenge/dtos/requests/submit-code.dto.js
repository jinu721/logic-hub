"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitChallengeDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SubmitChallengeDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.challengeId)
            errors.push("Invalid challenge ID");
        if (!this.userCode)
            errors.push("Code is required");
        if (!this.language)
            errors.push("Language is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SubmitChallengeDto = SubmitChallengeDto;
