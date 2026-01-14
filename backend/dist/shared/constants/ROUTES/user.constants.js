"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.USER_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    CHECK_USER: "/check-user",
    RESEND_OTP: "/resend-otp",
    VERIFY_ADMIN: "/verify-admin",
    ME: commen_routes_1.COMMON_ROUTES.ME,
    UPDATE_ME: commen_routes_1.COMMON_ROUTES.ME,
    BY_USERNAME: "/:username",
    BAN_USER: "/:userId/ban",
    GIFT_ITEM: "/:userId/gift/:type",
    CANCEL_MEMBERSHIP: "/membership/cancel",
    CLAIM_DAILY_REWARD: "/daily-reward/claim",
    PURCHASE_MARKET: "/purchase/market/:id",
};
