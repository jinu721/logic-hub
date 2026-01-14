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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../user/dtos");
class AuthController {
    constructor(authSvc) {
        this.authSvc = authSvc;
        this.register = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.RegisterRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(400, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this.authSvc.register(dto);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.CREATED, result, "OTP sent successfully");
        }));
        this.verifyOTP = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.VerifyOtpRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(400, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const ctx = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"] || "unknown",
                res,
            };
            const result = yield this.authSvc.verifyOTP(dto, ctx);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Account verified successfully");
        }));
        this.login = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.LoginRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, ((_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", ")) || "Validation failed");
            }
            const ctx = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"] || "unknown",
                res,
            };
            const result = yield this.authSvc.login(dto, ctx);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Login completed successfully");
        }));
        this.verifyLogin = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.VerifyLoginDto.from({ token: req.query.token });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const ctx = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"] || "unknown",
                res,
            };
            const result = yield this.authSvc.verifyLogin(dto.token, ctx);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Login verified successfully");
        }));
        this.refreshToken = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const dto = dtos_1.RefreshTokenDto.from({ refreshToken: (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            }
            const ctx = { res };
            const result = yield this.authSvc.refreshAccessToken(dto.refreshToken, ctx);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result, "Token refreshed successfully");
        }));
        this.googleAuthCallback = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Authentication failed!");
            }
            const ctx = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"] || "unknown",
                res,
            };
            const url = yield this.authSvc.socialAuthCallback(req.user, ctx);
            return res.redirect(url);
        }));
        this.githubAuthCallback = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Authentication failed!");
            }
            const ctx = {
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"] || "unknown",
                res,
            };
            const url = yield this.authSvc.socialAuthCallback(req.user, ctx);
            return res.redirect(url);
        }));
        this.forgotPassword = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.ForgotPasswordDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this.authSvc.forgotPassword(dto.email);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.resetPassword = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.ResetPasswordRequestDto.from({
                token: req.query.token,
                password: req.body.password,
            });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(400, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this.authSvc.resetPasswordWithLinkToken(dto.token, dto.password);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.changePassword = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.ChangePasswordRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(400, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            }
            const result = yield this.authSvc.changePassword(userId, dto.oldPassword, dto.newPassword);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.getMe = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const me = yield this.authSvc.getMe(userId);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, me);
        }));
        this.logout = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const bearer = req.headers["authorization"];
            const dto = dtos_1.LogoutRequestDto.from({
                userId,
                token: bearer === null || bearer === void 0 ? void 0 : bearer.split(" ")[1]
            });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(401, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            }
            const ctx = { res };
            const result = yield this.authSvc.logout(dto.userId, dto.token, ctx);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.clearCookies = (0, application_1.asyncHandler)((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authSvc.clearCookies(res);
            return (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
    }
}
exports.AuthController = AuthController;
