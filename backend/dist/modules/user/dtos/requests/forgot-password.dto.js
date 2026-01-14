"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class ForgotPasswordDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.email)
            errors.push("Email is required");
        if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push("Invalid email format");
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.ForgotPasswordDto = ForgotPasswordDto;
