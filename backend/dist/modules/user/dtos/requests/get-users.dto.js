"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersRequestDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetUsersRequestDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.search = "";
        this.page = 1;
        this.limit = 20;
    }
    validate() {
        const errors = [];
        if (this.page < 1)
            errors.push("page must be greater than 0");
        if (this.limit < 1)
            errors.push("limit must be greater than 0");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetUsersRequestDto = GetUsersRequestDto;
