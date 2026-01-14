"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.isErrorDetailsObject = isErrorDetailsObject;
class AppError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function isErrorDetailsObject(details) {
    return typeof details === "object" && details !== null && !Array.isArray(details);
}
