import { BaseDto } from "@shared/dtos/base.dto";

export class GetAllChallengesDto extends BaseDto {
  search: string = "";
  page: number = 1;
  limit: number = 10;

  validate() {
    const errors: string[] = [];
    if (this.page < 1) errors.push("Page must be >= 1");
    if (this.limit < 1 || this.limit > 100) errors.push("Limit must be 1-100");
    return { valid: errors.length === 0, errors };
  }
}
