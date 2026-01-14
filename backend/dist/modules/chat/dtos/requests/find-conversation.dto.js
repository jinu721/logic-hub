"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindConversationDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class FindConversationDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.conversationId)
            errors.push("Conversation ID is required");
        if (!this.userId)
            errors.push("User ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.FindConversationDto = FindConversationDto;
