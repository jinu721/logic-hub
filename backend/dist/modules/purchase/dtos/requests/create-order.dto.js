"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateOrderDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.amount)
            errors.push("Amount is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateOrderDto = CreateOrderDto;
