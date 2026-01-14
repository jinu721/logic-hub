"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardQueryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class LeaderboardQueryDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.based = "txp";
        this.category = "";
        this.period = "week";
        this.order = "desc";
        this.page = 1;
        this.limit = 10;
    }
    static from(data) {
        const instance = new this();
        Object.assign(instance, data);
        if ('page' in instance && typeof instance.page === 'string') {
            instance.page = parseInt(instance.page, 10);
        }
        if ('limit' in instance && typeof instance.limit === 'string') {
            instance.limit = parseInt(instance.limit, 10);
        }
        return instance;
    }
    validate() {
        const allowedBased = ["txp", "score", "fastest", "memory", "cpu", "attempts"];
        const allowedPeriod = ["day", "week", "month", "year", "all"];
        const allowedOrder = ["asc", "desc"];
        const errors = [];
        if (!allowedBased.includes(this.based))
            errors.push(`Invalid based type: ${this.based}`);
        if (!allowedPeriod.includes(this.period))
            errors.push(`Invalid period: ${this.period}`);
        if (!allowedOrder.includes(this.order))
            errors.push(`Invalid order: ${this.order}`);
        if (this.page < 1)
            errors.push("page must be >= 1");
        if (this.limit < 1 || this.limit > 100)
            errors.push("limit must be 1–100");
        return { valid: errors.length === 0, errors };
    }
}
exports.LeaderboardQueryDto = LeaderboardQueryDto;
