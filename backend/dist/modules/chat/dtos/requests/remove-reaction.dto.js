"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveReactionDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class RemoveReactionDto extends base_dto_1.BaseDto {
    validate() {
        const e = [];
        if (!this.messageId)
            e.push("messageId required");
        if (!this.userId)
            e.push("userId required");
        return { valid: e.length === 0, errors: e };
    }
}
exports.RemoveReactionDto = RemoveReactionDto;
