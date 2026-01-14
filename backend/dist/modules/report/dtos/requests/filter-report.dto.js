"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReportsFilterDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetReportsFilterDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.page = 1;
        this.limit = 10;
    }
    validate() {
        const errors = [];
        if (this.page < 1)
            errors.push("page must be >= 1");
        if (this.limit < 1)
            errors.push("limit must be >= 1");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetReportsFilterDto = GetReportsFilterDto;
