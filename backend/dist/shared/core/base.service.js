"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    mapOne(entity) {
        if (!entity)
            throw new Error("Cannot map null or undefined entity");
        return this.toDTO(entity);
    }
    mapMany(entities) {
        if (!entities || entities.length === 0)
            return [];
        return this.toDTOs(entities);
    }
}
exports.BaseService = BaseService;
