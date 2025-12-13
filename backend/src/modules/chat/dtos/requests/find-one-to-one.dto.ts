import { BaseDto } from "@shared/dtos/base.dto";

export class FindOneToOneDto extends BaseDto {
  userA!: string;
  userB!: string;

  validate() {
    const errors: string[] = [];
    if (!this.userA) errors.push("User A is required");
    if (!this.userB) errors.push("User B is required");
    return { valid: errors.length === 0, errors };
  }
}
