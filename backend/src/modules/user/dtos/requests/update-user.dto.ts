import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateUserRequestDto extends BaseDto {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  twoFactorEnabled?: boolean;
  notifications?: boolean;

  validate() {
    const errors: string[] = [];
    if (this.username && this.username.length < 3)
      errors.push("username must be at least 3 characters");
    if (this.email && !this.email.includes("@"))
      errors.push("email must be valid");
    if (this.bio && this.bio.length > 500)
      errors.push("bio too long");
    return { valid: errors.length === 0, errors };
  }
}
