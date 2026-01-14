"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMembershipDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateMembershipDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.name)
            errors.push("Name is required");
        if (!this.price)
            errors.push("Price is required");
        if (!this.description)
            errors.push("Description is required");
        if (!this.type)
            errors.push("Type is required");
        if (this.isActive === undefined)
            errors.push("isActive is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateMembershipDto = CreateMembershipDto;
