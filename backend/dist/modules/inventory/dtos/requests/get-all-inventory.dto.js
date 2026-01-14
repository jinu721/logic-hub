"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllInventoryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetAllInventoryDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.page = 1;
        this.limit = 10;
    }
    static from(data) {
        const instance = new this();
        Object.assign(instance, data);
        if (typeof instance.page === 'string') {
            instance.page = parseInt(instance.page, 10);
        }
        if (typeof instance.limit === 'string') {
            instance.limit = parseInt(instance.limit, 10);
        }
        return instance;
    }
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.GetAllInventoryDto = GetAllInventoryDto;
