"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMembershipDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateMembershipDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateMembershipDto = UpdateMembershipDto;
