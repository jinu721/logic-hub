import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateLevelDto extends BaseDto {
    id!: string;
    levelNumber?: number;
    requiredXP?: number;
    description?: string;
    rewards?: any[];

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("Level ID is required");
        return { valid: errors.length === 0, errors };
    }
}
