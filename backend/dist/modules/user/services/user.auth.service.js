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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const user_1 = require("../../user");
const env_1 = require("../../../config/env");
const token_1 = require("../../../shared/utils/token");
const database_1 = require("../../../shared/utils/database");
class AuthService extends _core_1.BaseService {
    constructor(userRepo, pendingRepo, tokenProv, emailProv, hashProv, tokenSvc) {
        super();
        this.userRepo = userRepo;
        this.pendingRepo = pendingRepo;
        this.tokenProv = tokenProv;
        this.emailProv = emailProv;
        this.hashProv = hashProv;
        this.tokenSvc = tokenSvc;
    }
    toDTO(user) { return (0, user_1.toPublicUserDTO)(user); }
    toDTOs(users) { return (0, user_1.toPublicUserDTOs)(users); }
    register(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = (yield this.userRepo.getByEmailOrUsername(dto.username)) ||
                (yield this.userRepo.getByEmailOrUsername(dto.email));
            if (exists)
                throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "User already exists");
            const hashed = yield this.hashProv.hashPassword(dto.password);
            const otp = (0, application_1.generateOTP)();
            yield this.pendingRepo.createPendingUser({ username: dto.username, email: dto.email, password: hashed, otp });
            yield this.emailProv.sendOTP(dto.email, otp);
            return { email: dto.email };
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const pending = yield this.pendingRepo.findPendingUserByEmail(email);
            if (!pending)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found or already verified");
            const otp = (0, application_1.generateOTP)();
            yield this.pendingRepo.updatePendingUserOtp(email, otp);
            yield this.emailProv.sendOTP(email, otp);
            return { email };
        });
    }
    verifyOTP(dto, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const pend = yield this.pendingRepo.findPendingUserByEmail(dto.email);
            if (!pend)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            if (pend.otp !== Number(dto.otp))
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Invalid OTP");
            yield this.userRepo.createUser({ username: pend.username, email: dto.email, password: pend.password });
            const user = yield this.userRepo.getByEmailOrUsername(dto.email);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.INTERNAL_SERVER_ERROR, "User create failed");
            yield this.pendingRepo.deletePendingUser(dto.email);
            const payload = {
                userId: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
                isBanned: user.isBanned,
                isVerified: user.isVerified
            };
            const accessToken = this.tokenProv.generateAccessToken(payload);
            const refreshToken = this.tokenProv.generateRefreshToken(payload);
            yield this.tokenSvc.createToken({
                userId: String(user._id),
                accessToken, refreshToken,
                ip: ctx.ip || undefined,
                device: ctx.userAgent || "unknown",
            });
            if (ctx.res) {
                (0, token_1.setAccessToken)(ctx.res, accessToken);
                (0, token_1.setRefreshToken)(ctx.res, refreshToken);
            }
            return { accessToken, refreshToken, user: this.mapOne(user) };
        });
    }
    login(dto, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getByEmailOrUsername(dto.identifier);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            if (user.loginType !== "normal")
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Use OAuth login");
            if (user.isBanned)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Your account has been banned");
            const valid = yield this.hashProv.comparePasswords(dto.password, user.password);
            if (!valid)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Invalid credentials");
            const payload = {
                userId: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
                isBanned: user.isBanned,
                isVerified: user.isVerified
            };
            const accessToken = this.tokenProv.generateAccessToken(payload);
            const refreshToken = this.tokenProv.generateRefreshToken(payload);
            yield this.tokenSvc.createToken({
                userId: String(user._id),
                accessToken, refreshToken,
                ip: ctx.ip || undefined,
                device: ctx.userAgent || "unknown",
            });
            if (ctx.res) {
                (0, token_1.setAccessToken)(ctx.res, accessToken);
                (0, token_1.setRefreshToken)(ctx.res, refreshToken);
            }
            return { isVerified: true, security: false, accessToken, refreshToken, user: this.mapOne(user) };
        });
    }
    verifyLogin(token, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = this.tokenProv.verifyLinkToken(token);
            const user = yield this.userRepo.getUserById(decoded.userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const payload = {
                userId: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
                isBanned: user.isBanned,
                isVerified: user.isVerified
            };
            const accessToken = this.tokenProv.generateAccessToken(payload);
            const refreshToken = this.tokenProv.generateRefreshToken(payload);
            yield this.tokenSvc.createToken({
                userId: String(user._id),
                accessToken, refreshToken,
                ip: ctx.ip || undefined,
                device: ctx.userAgent || "unknown",
            });
            if (ctx.res) {
                (0, token_1.setAccessToken)(ctx.res, accessToken);
                (0, token_1.setRefreshToken)(ctx.res, refreshToken);
            }
            return { accessToken, refreshToken, user: this.mapOne(user) };
        });
    }
    refreshAccessToken(refreshTokenCookie, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshTokenCookie) {
                throw new application_1.AppError(_constants_1.HttpStatus.FORBIDDEN, "Refresh token not found. Please log in again.");
            }
            const decoded = this.tokenProv.verifyRefreshToken(refreshTokenCookie);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
                throw new application_1.AppError(_constants_1.HttpStatus.FORBIDDEN, "Invalid refresh token. Please log in again.");
            }
            const user = yield this.userRepo.getUserById(decoded.userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const payload = {
                userId: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
                isBanned: user.isBanned,
                isVerified: user.isVerified
            };
            const newAccessToken = this.tokenProv.generateAccessToken(payload);
            if (ctx.res)
                (0, token_1.setAccessToken)(ctx.res, newAccessToken);
            return { accessToken: newAccessToken };
        });
    }
    socialLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getByEmailOrUsername(data.email);
            if (user) {
                const updates = {};
                if (data.loginType === "google" && !user.googleId) {
                    updates.googleId = data.profileId;
                }
                if (data.loginType === "github" && !user.githubId) {
                    updates.githubId = data.profileId;
                }
                if (Object.keys(updates).length > 0) {
                    yield this.userRepo.updateUser(user._id, updates);
                }
                return user;
            }
            const username = yield (0, application_1.generateUsername)(data.name);
            const newUser = yield this.userRepo.createUser(Object.assign(Object.assign({ username, email: data.email, loginType: data.loginType, isVerified: true }, (data.loginType === "google" && { googleId: data.profileId })), (data.loginType === "github" && { githubId: data.profileId })));
            return newUser;
        });
    }
    socialAuthCallback(oauthUser, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = String(oauthUser._id || oauthUser.id);
            // FETCH POPULATED
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const payload = {
                userId: String(user._id),
                username: user.username,
                email: user.email,
                role: user.role,
                isBanned: user.isBanned,
                isVerified: user.isVerified
            };
            const accessToken = this.tokenProv.generateAccessToken(payload);
            const refreshToken = this.tokenProv.generateRefreshToken(payload);
            yield this.tokenSvc.createToken({
                userId,
                accessToken, refreshToken,
                ip: ctx.ip || undefined,
                device: ctx.userAgent || "unknown",
            });
            if (ctx.res) {
                (0, token_1.setAccessToken)(ctx.res, accessToken);
                (0, token_1.setRefreshToken)(ctx.res, refreshToken);
            }
            return `${env_1.env.FRONTEND_URL}/home?logged=social&accessToken=${accessToken}`;
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getByEmailOrUsername(email);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Email not found");
            const token = this.tokenProv.generateResetToken(this.mapOne(user));
            const link = `${env_1.env.FRONTEND_URL}/auth/reset?token=${token}`;
            yield this.emailProv.sendLink(email, link);
            return { message: "Reset link sent" };
        });
    }
    resetPasswordWithLinkToken(linkToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, token_1.verifyLinkToken)(linkToken);
            if (!(payload === null || payload === void 0 ? void 0 : payload.userId))
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Invalid token");
            const hashed = yield this.hashProv.hashPassword(newPassword);
            yield this.userRepo.updateUser((0, application_1.toObjectId)(payload.userId), { password: hashed });
            return { message: "Password reset successfully" };
        });
    }
    changePassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const ok = yield this.hashProv.comparePasswords(oldPassword, user.password);
            if (!ok)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Old password incorrect");
            const hashed = yield this.hashProv.hashPassword(newPassword);
            yield this.userRepo.updateUser((0, application_1.toObjectId)(userId), { password: hashed });
            return { message: "Your password has been changed" };
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            return { role: user.role, isBanned: user.isBanned };
        });
    }
    logout(userId, bearerToken, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = jsonwebtoken_1.default.decode(bearerToken);
            if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
                const expiry = decoded.exp - Math.floor(Date.now() / 1000);
                if (expiry > 0) {
                    yield database_1.RedisHelper.set(`blacklist_${bearerToken}`, "true", expiry);
                }
            }
            yield this.tokenSvc.deleteTokenByUserId(userId);
            if (ctx.res) {
                (0, token_1.clearAuthCookies)(ctx.res);
            }
            return { message: "Logged out successfully" };
        });
    }
    clearCookies(res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, token_1.clearAuthCookies)(res);
            return { message: "Cookies cleared successfully" };
        });
    }
}
exports.AuthService = AuthService;
