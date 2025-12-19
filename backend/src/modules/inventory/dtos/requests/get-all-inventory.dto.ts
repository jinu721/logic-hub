import { BaseDto } from "@shared/dtos/base.dto";

export class GetAllInventoryDto extends BaseDto {
    search?: string;
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
        return { valid: true, errors: [] };
    }
}
