"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = void 0;
const cookie_options_1 = require("./cookie.options");
const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", (0, cookie_options_1.getCookieOptions)());
    res.clearCookie("refreshToken", (0, cookie_options_1.getCookieOptions)());
};
exports.clearAuthCookies = clearAuthCookies;
