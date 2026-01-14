"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateInventoryDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.UpdateInventoryDto = UpdateInventoryDto;
