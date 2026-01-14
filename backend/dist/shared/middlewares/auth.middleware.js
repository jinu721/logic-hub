"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const verify_token_1 = require("../utils/token/verify.token");
const redis_config_1 = __importDefault(require("../../config/redis.config"));
const app_error_1 = require("../utils/application/app.error");
const whitelist = ["/auth/logout", "/auth/refresh-token"];
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (whitelist.includes(req.path)) {
            return next();
        }
        const authHeader = req.headers["authorization"];
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            throw new app_error_1.AppError(401, "No token provided");
        }
        const isBlacklisted = yield redis_config_1.default.get(`blacklist_${token}`);
        if (isBlacklisted) {
            throw new app_error_1.AppError(403, "Token is blacklisted");
        }
        const user = (0, verify_token_1.verifyAccessToken)(token);
        if (!user) {
            throw new app_error_1.AppError(401, "Invalid or expired token");
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.authMiddleware = authMiddleware;
