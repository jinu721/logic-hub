import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateUserLevelDto extends BaseDto {
    userId!: string;
    xpPoints!: number;

    validate() {
        const errors: string[] = [];
        if (!this.userId) errors.push("User ID is required");
        if (this.xpPoints === undefined || this.xpPoints === null) errors.push("XP Points are required");
        return { valid: errors.length === 0, errors };
    }
}
