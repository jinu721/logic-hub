import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateMembershipDto extends BaseDto {
    id!: string;
    name?: string;
    price?: string;
    description?: string;
    type?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    features?: string[];
    discount?: any;

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
