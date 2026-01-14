"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetUserDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.username)
            errors.push("Username is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetUserDto = GetUserDto;
