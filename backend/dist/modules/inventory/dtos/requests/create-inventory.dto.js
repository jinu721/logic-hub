"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInventoryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateInventoryDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.name)
            errors.push("Name is required");
        if (!this.description)
            errors.push("Description is required");
        if (this.isActive === undefined || this.isActive === null)
            errors.push("isActive is required");
        if (!this.rarity)
            errors.push("Rarity is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateInventoryDto = CreateInventoryDto;
