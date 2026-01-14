"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.AUTH_ROUTES = {
    REGISTER: "/register",
    VERIFY_OTP: "/verify-otp",
    LOGIN: "/login",
    VERIFY_LOGIN: "/verify-login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    REFRESH_TOKEN: "/refresh-token",
    CHANGE_PASSWORD: "/change-password",
    ME: commen_routes_1.COMMON_ROUTES.ME,
    LOGOUT: "/logout",
    CLEAR_COOKIES: "/clear-cookies",
    GOOGLE: "/google",
    GOOGLE_CALLBACK: "/google/callback",
    GITHUB: "/github",
    GITHUB_CALLBACK: "/github/callback",
};
