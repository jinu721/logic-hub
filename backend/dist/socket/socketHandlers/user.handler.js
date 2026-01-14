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
exports.UserHandler = void 0;
const verify_token_1 = require("../../shared/utils/token/verify.token");
const redis_config_1 = __importDefault(require("../../config/redis.config"));
class UserHandler {
    constructor(io, container) {
        this.io = io;
        this.container = container;
    }
    setupUserHandlers(socket) {
        socket.on("register_user", this.handleRegisterUser.bind(this, socket));
        socket.on("user-online", this.handleUserOnline.bind(this, socket));
        socket.on("check-user-status", this.handleCheckUserStatus.bind(this, socket));
        socket.on("challenge-started", this.handleChallengeStarted.bind(this, socket));
        socket.on("challenge-ended", this.handleChallengeEnded.bind(this, socket));
        socket.on("disconnect", this.handleDisconnect.bind(this, socket));
    }
    handleRegisterUser(socket, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (0, verify_token_1.verifyAccessToken)(accessToken);
            try {
                if (!(user === null || user === void 0 ? void 0 : user.userId))
                    return;
                yield redis_config_1.default.sAdd(`sockets:${user.userId}`, socket.id);
                socket.userId = user.userId;
                yield this.container.userCommandSvc.updateUser(user.userId, { isOnline: true });
                yield redis_config_1.default.set(`user:online:${String(user.userId)}`, "true");
                this.io.emit("user-status", { userId: user.userId, status: true });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    handleUserOnline(socket, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, verify_token_1.verifyAccessToken)(accessToken);
                yield this.container.userCommandSvc.updateUser(user === null || user === void 0 ? void 0 : user.userId, { isOnline: true });
                yield redis_config_1.default.set(`user:online:${String(user === null || user === void 0 ? void 0 : user.userId)}`, "true");
                this.io.emit("user-status", { userId: user === null || user === void 0 ? void 0 : user.userId, status: true });
                yield redis_config_1.default.sAdd(`sockets:${user === null || user === void 0 ? void 0 : user.userId}`, socket.id);
                yield redis_config_1.default.set(`socket:user:${socket.id}`, String(user === null || user === void 0 ? void 0 : user.userId));
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    handleCheckUserStatus(socket, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield redis_config_1.default.get(`user:online:${userId}`);
                const isOnline = status === "true";
                socket.emit("user-status", { userId, status: isOnline });
            }
            catch (err) {
                console.error("Error checking user status:", err);
            }
        });
    }
    handleChallengeStarted(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { challengeId, accessToken }) {
            try {
                const user = (0, verify_token_1.verifyAccessToken)(accessToken);
                console.log("User Online :- ", user === null || user === void 0 ? void 0 : user.userId);
                const roomName = `challenge-${challengeId}`;
                const redisKey = `users:${roomName}`;
                yield redis_config_1.default.sAdd(redisKey, user === null || user === void 0 ? void 0 : user.userId);
                const startedCount = yield redis_config_1.default.sCard(redisKey);
                socket.join(roomName);
                const privateRoom = `progress-${user === null || user === void 0 ? void 0 : user.userId}`;
                socket.join(privateRoom);
                console.log(`Socket ${socket.id} joined room: progress-${user === null || user === void 0 ? void 0 : user.userId}`);
                const privateRoom2 = `preview-${user === null || user === void 0 ? void 0 : user.userId}`;
                socket.join(privateRoom2);
                console.log(`Socket ${socket.id} joined room: preview-${user === null || user === void 0 ? void 0 : user.userId}`);
                this.io.to(roomName).emit("challenge-started-count", {
                    challengeId,
                    startedCount: startedCount,
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    handleChallengeEnded(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { challengeId, accessToken }) {
            try {
                const user = (0, verify_token_1.verifyAccessToken)(accessToken);
                ;
                const roomName = `challenge-${challengeId}`;
                const redisKey = `users:${roomName}`;
                yield redis_config_1.default.sRem(redisKey, user === null || user === void 0 ? void 0 : user.userId);
                const startedCount = yield redis_config_1.default.sCard(redisKey);
                socket.leave(roomName);
                this.io.to(roomName).emit("challenge-started-count", {
                    challengeId,
                    startedCount,
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    handleDisconnect(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = socket.userId;
            if (!userId)
                return;
            console.log(`User ${userId} disconnected logic started`);
            try {
                yield redis_config_1.default.sRem(`sockets:${userId}`, socket.id);
                const remainingSockets = yield redis_config_1.default.sCard(`sockets:${userId}`);
                if (remainingSockets <= 0) {
                    console.log(`User ${userId} marked offline (no remaining sockets)`);
                    const now = new Date();
                    yield this.container.userCommandSvc.updateUser(userId, {
                        isOnline: false,
                        lastSeen: now,
                    });
                    yield redis_config_1.default.set(`user:online:${userId}`, "false");
                    this.io.emit("user-status", { userId, status: false, lastSeen: now.toISOString() });
                }
                else {
                    console.log(`User ${userId} still online on ${remainingSockets} other sockets`);
                }
                yield redis_config_1.default.del(`socket:user:${socket.id}`);
            }
            catch (err) {
                console.error("Error in disconnect handler:", err);
            }
        });
    }
}
exports.UserHandler = UserHandler;
