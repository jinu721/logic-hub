"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMembershipPurchaseDto = void 0;
const base_dto_1 = require("../../../../shared/dtos/base.dto");
class CreateMembershipPurchaseDto extends base_dto_1.BaseDto {
    validate() {
        const errors = [];
        if (!this.planId)
            errors.push("Plan ID is required");
        if (!this.amount)
            errors.push("Amount is required");
        if (!this.razorpayOrderId)
            errors.push("Razorpay Order ID is required");
        if (!this.razorpayPaymentId)
            errors.push("Razorpay Payment ID is required");
        if (!this.razorpaySignature)
            errors.push("Razorpay Signature is required");
        return { valid: errors.length === 0, errors };
    }
}
exports.CreateMembershipPurchaseDto = CreateMembershipPurchaseDto;
