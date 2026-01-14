"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/application/logger"));
const app_error_1 = require("../utils/application/app.error");
const env_1 = require("../../config/env");
const errorHandler = (err, req, res, _next) => {
    const isAppError = err instanceof app_error_1.AppError;
    const statusCode = isAppError ? err.statusCode : 500;
    const message = isAppError ? err.message : "Internal Server Error";
    const rawDetails = isAppError ? err.details : null;
    const safeDetails = (0, app_error_1.isErrorDetailsObject)(rawDetails) ? rawDetails : undefined;
    logger_1.default.error(`${req.method} ${req.url} - ${statusCode} - ${message}`, {
        stack: isAppError ? err.stack : undefined,
        details: safeDetails !== null && safeDetails !== void 0 ? safeDetails : null,
    });
    res.status(statusCode).json(Object.assign({ success: false, message }, (env_1.env.NODE_ENV === "development" && {
        stack: isAppError ? err.stack : undefined,
        details: safeDetails,
    })));
};
exports.errorHandler = errorHandler;
