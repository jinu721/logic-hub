import { BaseDto } from "@shared/dtos/base.dto";
import { ReportStatus } from "@shared/types";

export class UpdateReportStatusDto extends BaseDto {
    id!: string;
    status!: ReportStatus;

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("ID is required");
        if (!this.status) errors.push("status is required");
        return { valid: errors.length === 0, errors };
    }
}
