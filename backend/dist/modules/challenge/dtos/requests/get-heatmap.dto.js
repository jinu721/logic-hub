"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHeatmapRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetHeatmapRequestDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (this.year && (isNaN(this.year) || this.year < 2000 || this.year > 2100)) {
            errors.push("Year must be a valid number between 2000 and 2100");
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.GetHeatmapRequestDto = GetHeatmapRequestDto;
