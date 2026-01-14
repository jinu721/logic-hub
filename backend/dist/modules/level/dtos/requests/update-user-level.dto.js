"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserLevelDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateUserLevelDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("User ID is required");
        if (this.xpPoints === undefined || this.xpPoints === null)
            errors.push("XP Points are required");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateUserLevelDto = UpdateUserLevelDto;
