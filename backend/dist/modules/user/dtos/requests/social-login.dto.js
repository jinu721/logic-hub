"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLogin = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class SocialLogin extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.username && !this.email)
            errors.push("Username or email is required");
        if (!this.loginType)
            errors.push("Login type is required");
        if (!this.googleId && !this.githubId)
            errors.push("Google ID or GitHub ID is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.SocialLogin = SocialLogin;
