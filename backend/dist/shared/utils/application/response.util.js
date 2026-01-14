"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, status, result, message) => {
    return res.status(status).json({
        success: true,
        message,
        result,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, status, error, result) => {
    const message = error instanceof Error
        ? error.message
        : typeof error === "string"
            ? error
            : "Something went wrong";
    return res.status(status).json({
        success: false,
        message,
        result,
    });
};
exports.sendError = sendError;
