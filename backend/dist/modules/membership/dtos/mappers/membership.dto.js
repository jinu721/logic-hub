"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicMembershipDTOs = exports.toPublicMembershipDTO = void 0;
const toPublicMembershipDTO = (plan) => {
    return {
        _id: plan._id ? plan._id.toString() : "",
        name: plan.name,
        price: plan.price,
        description: plan.description,
        type: plan.type,
        isActive: plan.isActive,
        isFeatured: plan.isFeatured,
        features: plan.features,
        discount: {
            active: plan.discount.active,
            amount: plan.discount.amount,
            type: plan.discount.type,
            validUntil: plan.discount.validUntil,
        },
    };
};
exports.toPublicMembershipDTO = toPublicMembershipDTO;
const toPublicMembershipDTOs = (plans) => {
    return plans.map(exports.toPublicMembershipDTO);
};
exports.toPublicMembershipDTOs = toPublicMembershipDTOs;
