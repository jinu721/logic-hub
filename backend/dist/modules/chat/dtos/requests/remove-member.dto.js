"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMemberDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class RemoveMemberDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.groupId)
            errors.push("GroupId required");
        if (!this.userId)
            errors.push("UserId required");
        return { valid: errors.length === 0, errors };
    }
}
exports.RemoveMemberDto = RemoveMemberDto;
