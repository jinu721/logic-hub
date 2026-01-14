"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshToken = exports.setAccessToken = void 0;
const cookie_options_1 = require("./cookie.options");
const setAccessToken = (res, token) => {
    res.cookie("accessToken", token, (0, cookie_options_1.getCookieOptions)(24 * 60 * 60 * 1000));
};
exports.setAccessToken = setAccessToken;
const setRefreshToken = (res, token) => {
    res.cookie("refreshToken", token, (0, cookie_options_1.getCookieOptions)(7 * 24 * 60 * 60 * 1000));
};
exports.setRefreshToken = setRefreshToken;
