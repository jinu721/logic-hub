"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLevelDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class DeleteLevelDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("Level ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.DeleteLevelDto = DeleteLevelDto;
