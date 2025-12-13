import { BaseDto } from "@shared/dtos/base.dto";
import { ReportStatus } from "@shared/types";

export class UpdateReportStatusRequestDto extends BaseDto {
  status!: ReportStatus;

  validate() {
    const errors: string[] = [];
    if (!this.status) errors.push("status is required");
    return { valid: errors.length === 0, errors };
  }
}
