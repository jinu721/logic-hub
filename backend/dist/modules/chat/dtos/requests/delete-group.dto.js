"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGroupDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class DeleteGroupDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.groupId)
            errors.push("GroupId required");
        return { valid: errors.length === 0, errors };
    }
}
exports.DeleteGroupDto = DeleteGroupDto;
