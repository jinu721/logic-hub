"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindConversationGroupDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class FindConversationGroupDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.groupId)
            errors.push("Group ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.FindConversationGroupDto = FindConversationGroupDto;
