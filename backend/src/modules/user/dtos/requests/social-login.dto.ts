import { BaseDto } from "@shared/dtos/base.dto";

export class SocialLogin extends BaseDto {
    username?: string;
    email?: string;
    loginType?: "google" | "github";
    googleId?: string;
    githubId?: string;

    validate() {
        const errors = [];
        if (!this.username && !this.email) errors.push("Username or email is required");
        if (!this.loginType) errors.push("Login type is required");
        if (!this.googleId && !this.githubId) errors.push("Google ID or GitHub ID is required");
        return { valid: errors.length === 0, errors };
    }
}