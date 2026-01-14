"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SendMessageDto extends base_dto_1.BaseDto {
    validate() {
        const e = [];
        if (!this.conversationId)
            e.push("conversationId required");
        if (!this.type)
            e.push("message type required");
        return { valid: e.length === 0, errors: e };
    }
}
exports.SendMessageDto = SendMessageDto;
