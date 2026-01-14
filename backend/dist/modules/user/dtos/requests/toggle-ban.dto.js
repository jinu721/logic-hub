"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBanRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class ToggleBanRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("userId required");
        return { valid: errors.length === 0, errors };
    }
}
exports.ToggleBanRequestDto = ToggleBanRequestDto;
