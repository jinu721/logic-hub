import { BaseDto } from "@shared/dtos/base.dto";

export class CreateLevelDto extends BaseDto {
    levelNumber!: number;
    requiredXP!: number;
    description!: string;
    rewards?: any[];

    validate() {
        const errors: string[] = [];
        if (this.levelNumber === undefined) errors.push("Level number is required");
        if (this.requiredXP === undefined) errors.push("Required XP is required");
        if (!this.description) errors.push("Description is required");
        return { valid: errors.length === 0, errors };
    }
}
