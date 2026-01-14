"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class ResetPasswordRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.token)
            errors.push("token is required");
        if (!this.password)
            errors.push("password is required");
        if (this.password && this.password.length < 6)
            errors.push("password must be at least 6 characters");
        return { valid: errors.length === 0, errors };
    }
}
exports.ResetPasswordRequestDto = ResetPasswordRequestDto;
