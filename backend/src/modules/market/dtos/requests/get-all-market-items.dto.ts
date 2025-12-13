import { BaseDto } from "@shared/dtos/base.dto";

export class GetAllMarketItemsDto extends BaseDto {
    category?: string;
    searchQuery?: string;
    sortOption?: string;
    page?: number;
    limit?: number;

    validate() {
        return { valid: true, errors: [] };
    }
}
