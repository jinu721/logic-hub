"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReportDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateReportDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.reporter)
            errors.push("reporter is required");
        if (!this.reportedType)
            errors.push("reportedType is required");
        if (!this.reportedId)
            errors.push("reportedId is required");
        if (!this.reason)
            errors.push("reason is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateReportDto = CreateReportDto;
