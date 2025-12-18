import { BaseDto } from "@shared/dtos/base.dto";

export class UpdateNotificationDto extends BaseDto {
    id!: string;
    userId?: string;
    title?: string;
    message?: string;
    type?: string;
    itemData?: unknown;
    isRead?: boolean;

    validate() {
        const errors: string[] = [];
        if (!this.id) errors.push("ID is required");
        return { valid: errors.length === 0, errors };
    }
}
