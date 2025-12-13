import { BaseDto } from "@shared/dtos/base.dto";

export class ForgotPasswordDto extends BaseDto {
    email!: string;

    validate() {
        const errors: string[] = [];
        if (!this.email) errors.push("Email is required");
        if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push("Invalid email format");
        }
        return { valid: errors.length === 0, errors };
    }
}
