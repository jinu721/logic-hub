import { BaseDto } from "@shared/dtos/base.dto";

export class CreateMembershipPurchaseDto extends BaseDto {
    planId!: string;
    amount!: number;
    razorpayOrderId!: string;
    razorpayPaymentId!: string;
    razorpaySignature!: string;

    validate() {
        const errors: string[] = [];
        if (!this.planId) errors.push("Plan ID is required");
        if (!this.amount) errors.push("Amount is required");
        if (!this.razorpayOrderId) errors.push("Razorpay Order ID is required");
        if (!this.razorpayPaymentId) errors.push("Razorpay Payment ID is required");
        if (!this.razorpaySignature) errors.push("Razorpay Signature is required");
        return { valid: errors.length === 0, errors };
    }
}
