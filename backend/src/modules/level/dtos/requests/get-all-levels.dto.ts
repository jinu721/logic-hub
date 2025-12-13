import { BaseDto } from "@shared/dtos/base.dto";

export class GetAllLevelsDto extends BaseDto {
    page?: number;
    limit?: number;

    validate() {
        return { valid: true, errors: [] };
    }
}
