"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyLoginDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class VerifyLoginDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.token)
            errors.push("Token is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.VerifyLoginDto = VerifyLoginDto;
