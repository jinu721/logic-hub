import { BaseDto } from "@shared/dtos/base.dto";

export class RefreshTokenDto extends BaseDto {
    refreshToken!: string;

    validate() {
        const errors: string[] = [];
        if (!this.refreshToken) errors.push("Refresh token is required");
        return { valid: errors.length === 0, errors };
    }
}
