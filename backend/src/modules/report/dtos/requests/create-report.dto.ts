import { BaseDto } from "@shared/dtos/base.dto";
import { Types } from "mongoose";
import { ReportedType } from "@shared/types";

export class CreateReportDto extends BaseDto {
  reporter!: Types.ObjectId;
  reportedType!: ReportedType;
  reportedId!: Types.ObjectId;
  reason!: string;
  description?: string;

  validate() {
    const errors: string[] = [];

    if (!this.reporter) errors.push("reporter is required");
    if (!this.reportedType) errors.push("reportedType is required");
    if (!this.reportedId) errors.push("reportedId is required");
    if (!this.reason) errors.push("reason is required");

    return { valid: errors.length === 0, errors };
  }
}
