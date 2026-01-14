"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsByChallengeDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SubmissionsByChallengeDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.challengeId)
            errors.push("Challenge ID required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SubmissionsByChallengeDto = SubmissionsByChallengeDto;
