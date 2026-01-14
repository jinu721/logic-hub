"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateGroupDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.name)
            errors.push("Group name required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateGroupDto = CreateGroupDto;
