"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOneToOneDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateOneToOneDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("User ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateOneToOneDto = CreateOneToOneDto;
