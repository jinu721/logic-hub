"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicPurchaseDTOs = exports.toPublicPurchaseDTO = void 0;
const toPublicPurchaseDTO = (purchase) => {
    return {
        _id: purchase._id ? purchase._id.toString() : "",
        userId: purchase.userId.toString(),
        planId: purchase.planId.toString(),
        razorpayOrderId: purchase.razorpayOrderId,
        razorpayPaymentId: purchase.razorpayPaymentId,
        razorpaySignature: purchase.razorpaySignature,
        amount: purchase.amount,
        status: purchase.status,
        startedAt: purchase.startedAt,
        expiresAt: purchase.expiresAt,
    };
};
exports.toPublicPurchaseDTO = toPublicPurchaseDTO;
const toPublicPurchaseDTOs = (purchases) => {
    return purchases.map(exports.toPublicPurchaseDTO);
};
exports.toPublicPurchaseDTOs = toPublicPurchaseDTOs;
