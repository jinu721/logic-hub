"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetReportDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetReportDto = GetReportDto;
