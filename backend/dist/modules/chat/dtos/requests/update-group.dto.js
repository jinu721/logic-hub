"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateGroupDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.groupId)
            errors.push("GroupId required");
        if (!this.payload)
            errors.push("Payload required");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateGroupDto = UpdateGroupDto;
