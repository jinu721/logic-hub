import { BaseDto } from "@shared/dtos/base.dto";

export class GetMembershipDto extends BaseDto {
    id!: string;

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
