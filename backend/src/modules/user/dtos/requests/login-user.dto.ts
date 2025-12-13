import { BaseDto } from "@shared/dtos/base.dto";

export class LoginRequestDto extends BaseDto {
  identifier!: string;
  password!: string;

  validate() {
    const errors: string[] = [];
    if (!this.identifier) errors.push("identifier is required");
    if (!this.password) errors.push("password is required");
    return { valid: errors.length === 0, errors };
  }
}
