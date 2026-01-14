"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class FindUserRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.value)
            errors.push("value is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.FindUserRequestDto = FindUserRequestDto;
