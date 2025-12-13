import { BaseDto } from "@shared/dtos/base.dto";

export class CreateNotificationDto extends BaseDto {
    userId!: string;
    title!: string;
    message!: string;
    type!: string;
    itemData?: any;
    isRead?: boolean;

    validate() {
        const errors: string[] = [];
        if (!this.userId) errors.push("User ID is required");
        if (!this.title) errors.push("Title is required");
        if (!this.message) errors.push("Message is required");
        if (!this.type) errors.push("Type is required");
        return { valid: errors.length === 0, errors };
    }
}
