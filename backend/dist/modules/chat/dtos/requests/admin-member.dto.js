"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMemberDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class AdminMemberDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.conversationId)
            errors.push("conversationId required");
        if (!this.groupId)
            errors.push("groupId required");
        if (!this.userId)
            errors.push("userId required");
        return { valid: errors.length === 0, errors };
    }
}
exports.AdminMemberDto = AdminMemberDto;
