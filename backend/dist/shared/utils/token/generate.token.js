"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLinkToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const generateAccessToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isBanned: user.isBanned,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2d",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isBanned: user.isBanned,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateLinkToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.VERIFY_TOKEN_SECRET, {
        expiresIn: "10m",
    });
};
exports.generateLinkToken = generateLinkToken;
