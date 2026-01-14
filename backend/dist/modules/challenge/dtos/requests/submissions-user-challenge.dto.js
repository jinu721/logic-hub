"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsUserChallengeDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SubmissionsUserChallengeDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("User ID required");
        if (!this.challengeId)
            errors.push("Challenge ID required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SubmissionsUserChallengeDto = SubmissionsUserChallengeDto;
