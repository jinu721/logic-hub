"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const verify_token_1 = require("../../shared/utils/token/verify.token");
const authMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }
    const user = (0, verify_token_1.verifyAccessToken)(token);
    if (!user) {
        return next(new Error("Authentication error: Invalid token"));
    }
    socket.userId = user.userId;
    next();
};
exports.authMiddleware = authMiddleware;
