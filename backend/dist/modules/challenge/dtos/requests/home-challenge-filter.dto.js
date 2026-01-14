"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHomeFiltersDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UserHomeFiltersDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (this.type && !["code", "mcq", "quiz"].includes(this.type))
            errors.push("Invalid type");
        if (this.level && !["beginner", "adept", "master"].includes(this.level))
            errors.push("Invalid level");
        return { valid: errors.length === 0, errors };
    }
}
exports.UserHomeFiltersDto = UserHomeFiltersDto;
