"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllChallengesDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetAllChallengesDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.search = "";
        this.page = 1;
        this.limit = 10;
    }
    validate() {
        const errors = [];
        if (this.page < 1)
            errors.push("Page must be >= 1");
        if (this.limit < 1 || this.limit > 100)
            errors.push("Limit must be 1-100");
        return { valid: errors.length === 0, errors };
    }
}
exports.GetAllChallengesDto = GetAllChallengesDto;
