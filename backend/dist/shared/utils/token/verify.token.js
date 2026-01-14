"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLinkToken = exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
;
;
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.ACCESS_TOKEN_SECRET);
        return decoded;
    }
    catch (err) {
        console.error("Access Token verification failed:", err);
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.REFRESH_TOKEN_SECRET);
        return decoded;
    }
    catch (err) {
        console.error("Refresh Token verification failed:", err);
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const verifyLinkToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.VERIFY_TOKEN_SECRET);
        return decoded;
    }
    catch (err) {
        console.error("Link Token verification failed:", err);
        return null;
    }
};
exports.verifyLinkToken = verifyLinkToken;
