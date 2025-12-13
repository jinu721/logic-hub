import { BaseDto } from "@shared/dtos/base.dto";

export class LogoutRequestDto extends BaseDto {
  userId!: string;
  token!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userId) errors.push("userId is required");
    if (!this.token) errors.push("token is required");
    return { valid: errors.length === 0, errors };
  }
}
