"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLevelDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateLevelDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (this.levelNumber === undefined)
            errors.push("Level number is required");
        if (this.requiredXP === undefined)
            errors.push("Required XP is required");
        if (!this.description)
            errors.push("Description is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateLevelDto = CreateLevelDto;
