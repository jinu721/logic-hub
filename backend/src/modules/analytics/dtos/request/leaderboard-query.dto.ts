import { BaseDto } from "@shared/dtos/base.dto";
import { LeaderboardPeriod, LeaderboardSortField, SortOrder } from "@shared/types";

export class LeaderboardQueryDto extends BaseDto {
  based: LeaderboardSortField = "txp";
  category: string = "";
  period: LeaderboardPeriod = "week";
  order: SortOrder = "desc";
  page: number = 1;
  limit: number = 10;

  static from<T extends BaseDto>(this: new () => T, data: Partial<T>): T {
    const instance = new this();
    Object.assign(instance, data);
    if ('page' in instance && typeof (instance as any).page === 'string') {
      (instance as any).page = parseInt((instance as any).page, 10);
    }
    if ('limit' in instance && typeof (instance as any).limit === 'string') {
      (instance as any).limit = parseInt((instance as any).limit, 10);
    }
    return instance;
  }

  validate() {
    const allowedBased = ["txp", "score", "fastest", "memory", "cpu", "attempts"];
    const allowedPeriod = ["day", "week", "month", "year", "all"];
    const allowedOrder = ["asc", "desc"];

    const errors: string[] = [];

    if (!allowedBased.includes(this.based))
      errors.push(`Invalid based type: ${this.based}`);

    if (!allowedPeriod.includes(this.period))
      errors.push(`Invalid period: ${this.period}`);

    if (!allowedOrder.includes(this.order))
      errors.push(`Invalid order: ${this.order}`);

    if (this.page < 1) errors.push("page must be >= 1");
    if (this.limit < 1 || this.limit > 100) errors.push("limit must be 1–100");

    return { valid: errors.length === 0, errors };
  }
}
