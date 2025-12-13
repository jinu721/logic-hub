import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateMarketItemDto extends BaseDto {
    id!: string;
    name?: string;
    description?: string;
    costXP?: number;
    itemId?: string;
    category?: string;
    available?: boolean;
    limitedTime?: boolean;
    isExclusive?: boolean;
    expiresAt?: Date;

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
