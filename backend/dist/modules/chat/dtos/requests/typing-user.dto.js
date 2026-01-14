"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingUserDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class TypingUserDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.conversationId)
            errors.push("Conversation ID is required");
        if (!this.userId)
            errors.push("User ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.TypingUserDto = TypingUserDto;
