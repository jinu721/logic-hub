"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestDto = exports.RegisterRequestDto = void 0;
const base_dto_1 = require("../../../shared/dtos/base.dto");
class RegisterRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.email || !this.email.includes('@'))
            errors.push("Invalid email");
        if (!this.username || this.username.length < 3)
            errors.push("Username too short");
        if (!this.password || this.password.length < 6)
            errors.push("Password too short");
        return { valid: errors.length === 0, errors };
    }
}
exports.RegisterRequestDto = RegisterRequestDto;
class LoginRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.email)
            errors.push("Email is required");
        if (!this.password)
            errors.push("Password is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.LoginRequestDto = LoginRequestDto;
