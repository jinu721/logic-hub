"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunCodeRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class RunCodeRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.language)
            errors.push("Language is required");
        if (!this.sourceCode)
            errors.push("No source code provided");
        if (!this.challengeId)
            errors.push("Challenge ID missing");
        return { valid: errors.length === 0, errors };
    }
}
exports.RunCodeRequestDto = RunCodeRequestDto;
