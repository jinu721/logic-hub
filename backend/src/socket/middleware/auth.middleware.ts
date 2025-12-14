import { ExtendedSocket } from "../../shared/types/socket.types";
import { verifyAccessToken } from "../../shared/utils/token/verify.token";
import { NextFunction } from "express";

export const authMiddleware = (socket: ExtendedSocket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    const user = verifyAccessToken(token as string);

    if (!user) {
        return next(new Error("Authentication error: Invalid token"));
    }

    socket.userId = user.userId;
    next();
};
