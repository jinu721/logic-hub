import { BaseDto } from "@shared/dtos/base.dto";

export class GetUserDto extends BaseDto {
    username!: string;

    validate() {
        const errors: string[] = [];
        if (!this.username) errors.push("Username is required");
        return { valid: errors.length === 0, errors };
    }
}
