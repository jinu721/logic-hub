"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOneToOneDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class FindOneToOneDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userA)
            errors.push("User A is required");
        if (!this.userB)
            errors.push("User B is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.FindOneToOneDto = FindOneToOneDto;
