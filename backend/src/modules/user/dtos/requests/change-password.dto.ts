import { BaseDto } from "@shared/dtos/base.dto";

export class ChangePasswordRequestDto extends BaseDto {
  oldPassword!: string;
  newPassword!: string;

  validate() {
    const errors: string[] = [];
    if (!this.oldPassword) errors.push("oldPassword is required");
    if (!this.newPassword) errors.push("newPassword is required");
    if (this.newPassword && this.newPassword.length < 6)
      errors.push("newPassword must be at least 6 characters");
    return { valid: errors.length === 0, errors };
  }
}
