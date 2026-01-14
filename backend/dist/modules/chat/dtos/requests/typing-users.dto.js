"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTypingUsersDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetTypingUsersDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.conversationId)
            errors.push("Conversation ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetTypingUsersDto = GetTypingUsersDto;
