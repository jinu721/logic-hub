import { BaseDto } from "@shared/dtos/base.dto";

export class CreateOrderDto extends BaseDto {
    amount!: number;

    validate() {
        const errors: string[] = [];
        if (!this.amount) errors.push("Amount is required");
        return { valid: errors.length === 0, errors };
    }
}
