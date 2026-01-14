"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionQueryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SolutionQueryDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.search = "";
        this.page = 1;
        this.limit = 10;
        this.sortBy = "likes";
    }
    validate() {
        const errors = [];
        if (this.page < 1)
            errors.push("Page must be >= 1");
        if (this.limit < 1 || this.limit > 100)
            errors.push("Limit must be 1-100");
        if (!["likes", "newest", "comments"].includes(this.sortBy)) {
            errors.push("sortBy must be likes/newest/comments");
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.SolutionQueryDto = SolutionQueryDto;
