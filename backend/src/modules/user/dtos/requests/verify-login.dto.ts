import { BaseDto } from "@shared/dtos/base.dto";

export class VerifyLoginDto extends BaseDto {
    token!: string;

    validate() {
        const errors: string[] = [];
        if (!this.token) errors.push("Token is required");
        return { valid: errors.length === 0, errors };
    }
}
