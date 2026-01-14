"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class UpdateNotificationDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.id)
            errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.UpdateNotificationDto = UpdateNotificationDto;
