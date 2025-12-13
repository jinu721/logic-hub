import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateUserRequestDto extends BaseDto {
  username?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;

  validate() {
    const errors: string[] = [];
    if (this.username && this.username.length < 3)
      errors.push("username must be at least 3 characters");
    if (this.bio && this.bio.length > 500)
      errors.push("bio too long");
    return { valid: errors.length === 0, errors };
  }
}
