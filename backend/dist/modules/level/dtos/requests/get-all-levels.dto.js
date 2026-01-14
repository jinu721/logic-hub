"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllLevelsDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetAllLevelsDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.GetAllLevelsDto = GetAllLevelsDto;
