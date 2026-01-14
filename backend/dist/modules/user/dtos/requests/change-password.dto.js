"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class ChangePasswordRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.oldPassword)
            errors.push("oldPassword is required");
        if (!this.newPassword)
            errors.push("newPassword is required");
        if (this.newPassword && this.newPassword.length < 6)
            errors.push("newPassword must be at least 6 characters");
        return { valid: errors.length === 0, errors };
    }
}
exports.ChangePasswordRequestDto = ChangePasswordRequestDto;
