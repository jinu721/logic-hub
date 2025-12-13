import { BaseDto } from "@shared/dtos/base.dto";

export class RegisterRequestDto extends BaseDto {
  email!: string;
  username!: string;
  password!: string;

  validate() {
    const errors: string[] = [];
    if (!this.email) errors.push("email is required");
    if (!this.username) errors.push("username is required");
    if (this.username && this.username.length < 3)
      errors.push("username must be at least 3 characters");
    if (!this.password) errors.push("password is required");
    if (this.password && this.password.length < 6)
      errors.push("password must be at least 6 characters");
    return { valid: errors.length === 0, errors };
  }
}
