import { BaseDto } from "@shared/dtos/base.dto";

export class GetAllMembershipsDto extends BaseDto {
    search?: string;
    page?: number;
    limit?: number;

    validate() {
        return { valid: true };
    }
}
