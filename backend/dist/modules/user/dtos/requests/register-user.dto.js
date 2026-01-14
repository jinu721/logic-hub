"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class RegisterRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.email)
            errors.push("email is required");
        if (!this.username)
            errors.push("username is required");
        if (this.username && this.username.length < 3)
            errors.push("username must be at least 3 characters");
        if (!this.password)
            errors.push("password is required");
        if (this.password && this.password.length < 6)
            errors.push("password must be at least 6 characters");
        return { valid: errors.length === 0, errors };
    }
}
exports.RegisterRequestDto = RegisterRequestDto;
