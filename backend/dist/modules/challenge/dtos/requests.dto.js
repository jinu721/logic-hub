"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChallengeRequestDto = exports.CreateChallengeRequestDto = void 0;
const base_dto_1 = require("../../../shared/dtos/base.dto");
class CreateChallengeRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.title)
            errors.push("Title is required");
        if (!this.description)
            errors.push("Description is required");
        if (!this.difficulty)
            errors.push("Difficulty is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateChallengeRequestDto = CreateChallengeRequestDto;
class UpdateChallengeRequestDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true }; // Partial updates might allow empty fields
    }
}
exports.UpdateChallengeRequestDto = UpdateChallengeRequestDto;
