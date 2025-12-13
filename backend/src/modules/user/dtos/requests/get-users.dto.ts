import { BaseDto } from "@shared/dtos/base.dto";

export class GetUsersRequestDto extends BaseDto {
  search: string = "";
  page: number = 1;
  limit: number = 20;

  validate() {
    const errors: string[] = [];
    if (this.page < 1) errors.push("page must be greater than 0");
    if (this.limit < 1) errors.push("limit must be greater than 0");
    return { valid: errors.length === 0, errors };
  }
}
