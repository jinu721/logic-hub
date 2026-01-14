"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMembersDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class AddMembersDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.groupId)
            errors.push("GroupId required");
        if (!this.memberIds || !Array.isArray(this.memberIds))
            errors.push("memberIds must be array");
        return { valid: errors.length === 0, errors };
    }
}
exports.AddMembersDto = AddMembersDto;
