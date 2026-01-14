"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProvider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
class TokenProvider {
    ensurePayload(data) {
        if (typeof data === "string" || !data || typeof data !== "object") {
            throw new Error("Invalid token payload");
        }
        return data;
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    }
    generateLinkToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.VERIFY_TOKEN_SECRET, { expiresIn: "1h" });
    }
    generateResetToken(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.RESET_TOKEN_SECRET, { expiresIn: "15m" });
    }
    verifyLinkToken(token) {
        return this.ensurePayload(jsonwebtoken_1.default.verify(token, env_1.env.VERIFY_TOKEN_SECRET));
    }
    verifyAccessToken(token) {
        return this.ensurePayload(jsonwebtoken_1.default.verify(token, env_1.env.ACCESS_TOKEN_SECRET));
    }
    verifyRefreshToken(token) {
        return this.ensurePayload(jsonwebtoken_1.default.verify(token, env_1.env.REFRESH_TOKEN_SECRET));
    }
    decodeToken(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || typeof decoded === "string")
            return null;
        return decoded;
    }
}
exports.TokenProvider = TokenProvider;
