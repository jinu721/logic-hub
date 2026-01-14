"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlanHistoryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetPlanHistoryDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.GetPlanHistoryDto = GetPlanHistoryDto;
