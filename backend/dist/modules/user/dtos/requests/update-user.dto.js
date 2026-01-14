"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateUserRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (this.username && this.username.length < 3)
            errors.push("username must be at least 3 characters");
        if (this.email && !this.email.includes("@"))
            errors.push("email must be valid");
        if (this.bio && this.bio.length > 500)
            errors.push("bio too long");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateUserRequestDto = UpdateUserRequestDto;
