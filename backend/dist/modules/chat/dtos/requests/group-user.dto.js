"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupUserDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GroupUserDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("UserId required");
        return { valid: errors.length === 0, errors };
    }
}
exports.GroupUserDto = GroupUserDto;
