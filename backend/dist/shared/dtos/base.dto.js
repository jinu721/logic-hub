"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDto = void 0;
class BaseDto {
    static from(data) {
        const instance = new this();
        Object.assign(instance, data);
        return instance;
    }
}
exports.BaseDto = BaseDto;
