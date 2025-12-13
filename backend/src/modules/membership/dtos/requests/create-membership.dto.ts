import { BaseDto } from "@shared/dtos/base.dto";

export class CreateMembershipDto extends BaseDto {
    name!: string;
    price!: string;
    description!: string;
    type!: string;
    isActive!: boolean;
    isFeatured!: boolean;
    features!: string[];
    discount?: any;

    validate() {
        const errors: string[] = [];
        if (!this.name) errors.push("Name is required");
        if (!this.price) errors.push("Price is required");
        if (!this.description) errors.push("Description is required");
        if (!this.type) errors.push("Type is required");
        if (this.isActive === undefined) errors.push("isActive is required");
        return { valid: errors.length === 0, errors };
    }
}
