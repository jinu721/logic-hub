import { BaseDto } from "@shared/dtos/base.dto";

export class CreateMarketItemDto extends BaseDto {
    name!: string;
    description?: string;
    costXP!: number;
    itemId!: string;
    category!: string;
    available?: boolean;
    limitedTime?: boolean;
    isExclusive?: boolean;
    expiresAt?: Date;

    validate() {
        const errors: string[] = [];
        if (!this.name) errors.push("Name is required");
        if (this.costXP === undefined) errors.push("Cost XP is required");
        if (!this.itemId) errors.push("Item ID is required");
        if (!this.category) errors.push("Category is required");
        return { valid: errors.length === 0, errors };
    }
}
