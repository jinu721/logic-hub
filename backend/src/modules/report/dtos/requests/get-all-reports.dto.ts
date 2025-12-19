import { BaseDto } from "@shared/dtos/base.dto";
import { ReportedType, ReportStatus } from "@shared/types";

export class GetAllReportsDto extends BaseDto {
    reportedType?: ReportedType;
    status?: ReportStatus;
    page: number = 1;
    limit: number = 10;

    static from<T extends BaseDto>(this: new () => T, data: Partial<T>): T {
        const instance = new this();
        Object.assign(instance, data);
        if (typeof (instance as any).page === 'string') {
            (instance as any).page = parseInt((instance as any).page, 10);
        }
        if (typeof (instance as any).limit === 'string') {
            (instance as any).limit = parseInt((instance as any).limit, 10);
        }
        return instance;
    }

    validate() {
        const errors: string[] = [];
        if (this.page < 1) errors.push("page must be >= 1");
        if (this.limit < 1) errors.push("limit must be >= 1");
        return { valid: errors.length === 0, errors };
    }
}
