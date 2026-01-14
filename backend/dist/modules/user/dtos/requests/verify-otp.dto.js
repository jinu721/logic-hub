"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class VerifyOtpRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.email)
            errors.push("email is required");
        if (!this.otp)
            errors.push("otp is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.VerifyOtpRequestDto = VerifyOtpRequestDto;
