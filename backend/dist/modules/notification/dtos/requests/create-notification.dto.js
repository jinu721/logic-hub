"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNotificationDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateNotificationDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.userId)
            errors.push("User ID is required");
        if (!this.title)
            errors.push("Title is required");
        if (!this.message)
            errors.push("Message is required");
        if (!this.type)
            errors.push("Type is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateNotificationDto = CreateNotificationDto;
