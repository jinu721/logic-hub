import { BaseDto } from "@shared/dtos/base.dto";

export class VerifyOtpRequestDto extends BaseDto {
  email!: string;
  otp!: string;

  validate() {
    const errors: string[] = [];
    if (!this.email) errors.push("email is required");
    if (!this.otp) errors.push("otp is required");
    return { valid: errors.length === 0, errors };
  }
}
