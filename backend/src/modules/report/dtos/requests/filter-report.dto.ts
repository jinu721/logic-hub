import { BaseDto } from "@shared/dtos/base.dto";
import { ReportedType, ReportStatus } from "@shared/types";

export class GetReportsFilterDto extends BaseDto {
  reportedType?: ReportedType;
  status?: ReportStatus;
  page: number = 1;
  limit: number = 10;

  validate() {
    const errors: string[] = [];
    if (this.page < 1) errors.push("page must be >= 1");
    if (this.limit < 1) errors.push("limit must be >= 1");
    return { valid: errors.length === 0, errors };
  }
}
