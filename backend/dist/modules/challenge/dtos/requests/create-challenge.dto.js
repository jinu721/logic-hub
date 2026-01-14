"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChallengeRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateChallengeRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.title)
            errors.push("Title is required");
        if (!this.instructions)
            errors.push("Instructions are required");
        if (!this.type)
            errors.push("Challenge type is required");
        if (!this.level)
            errors.push("Challenge level is required");
        if (!this.testCases || !Array.isArray(this.testCases) || this.testCases.length === 0)
            errors.push("At least one test case is required");
        if (!this.timeLimit || this.timeLimit <= 0)
            errors.push("Time limit must be greater than 0");
        if (!this.tags || !Array.isArray(this.tags) || this.tags.length === 0)
            errors.push("At least one tag is required");
        if (this.xpRewards == null || this.xpRewards < 0)
            errors.push("XP rewards must be a positive number");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateChallengeRequestDto = CreateChallengeRequestDto;
