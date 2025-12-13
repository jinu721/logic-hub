import { BaseDto } from "@shared/dtos/base.dto";

export class GetPlanHistoryDto extends BaseDto {
    page?: number;
    limit?: number;

    validate() {
        return { valid: true, errors: [] };
    }
}
