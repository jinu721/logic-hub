"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftItemRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GiftItemRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.itemId)
            errors.push("itemId is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.GiftItemRequestDto = GiftItemRequestDto;
