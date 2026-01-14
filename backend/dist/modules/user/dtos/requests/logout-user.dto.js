"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class LogoutRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("userId is required");
        if (!this.token)
            errors.push("token is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.LogoutRequestDto = LogoutRequestDto;
