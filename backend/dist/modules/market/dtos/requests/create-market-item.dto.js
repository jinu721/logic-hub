"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMarketItemDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateMarketItemDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.name)
            errors.push("Name is required");
        if (this.costXP === undefined)
            errors.push("Cost XP is required");
        if (!this.itemId)
            errors.push("Item ID is required");
        if (!this.category)
            errors.push("Category is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateMarketItemDto = CreateMarketItemDto;
