"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupQueryDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GroupQueryDto extends base_dto_1.BaseDto {
    constructor() {
        super(...arguments);
        this.page = 1;
        this.limit = 20;
    }
    static fromQuery(query) {
        const dto = new GroupQueryDto();
        if (query.name && typeof query.name === 'string')
            dto.name = query.name;
        if (query.search && typeof query.search === 'string')
            dto.search = query.search;
        if (query.type && typeof query.type === 'string')
            dto.type = query.type;
        if (query.isActive !== undefined)
            dto.isActive = query.isActive === "true" || query.isActive === true;
        if (query.members && typeof query.members === 'string')
            dto.members = query.members;
        if (query.createdBy && typeof query.createdBy === 'string')
            dto.createdBy = query.createdBy;
        if (query.category && typeof query.category === 'string')
            dto.category = query.category;
        if (query.tags && typeof query.tags === 'string') {
            dto.tags = query.tags.split(",");
        }
        else if (Array.isArray(query.tags)) {
            dto.tags = query.tags.map(String);
        }
        if (query.page)
            dto.page = parseInt(query.page.toString(), 10) || 1;
        if (query.limit)
            dto.limit = parseInt(query.limit.toString(), 10) || 10;
        return dto;
    }
    validate() {
        return { valid: true, errors: [] };
    }
}
exports.GroupQueryDto = GroupQueryDto;
