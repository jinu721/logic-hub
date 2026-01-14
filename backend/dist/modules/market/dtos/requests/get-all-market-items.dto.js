"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMarketItemsDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetAllMarketItemsDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.GetAllMarketItemsDto = GetAllMarketItemsDto;
