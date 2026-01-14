"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReportStatusRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateReportStatusRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.status)
            errors.push("status is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateReportStatusRequestDto = UpdateReportStatusRequestDto;
