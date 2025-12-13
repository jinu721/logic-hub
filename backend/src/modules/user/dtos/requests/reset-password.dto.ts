import { BaseDto } from "@shared/dtos/base.dto";

export class ResetPasswordRequestDto extends BaseDto {
  token!: string;
  password!: string;

  validate() {
    const errors: string[] = [];
    if (!this.token) errors.push("token is required");
    if (!this.password) errors.push("password is required");
    if (this.password && this.password.length < 6)
      errors.push("password must be at least 6 characters");
    return { valid: errors.length === 0, errors };
  }
}
