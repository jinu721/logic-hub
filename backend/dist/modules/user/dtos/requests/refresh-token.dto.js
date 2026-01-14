"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class RefreshTokenDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.refreshToken)
            errors.push("Refresh token is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.RefreshTokenDto = RefreshTokenDto;
