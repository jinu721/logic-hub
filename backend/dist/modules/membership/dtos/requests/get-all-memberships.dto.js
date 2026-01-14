"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMembershipsDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class GetAllMembershipsDto extends base_dto_1.BaseDto {
    validate() {
        return { valid: true };
    }
}
exports.GetAllMembershipsDto = GetAllMembershipsDto;
