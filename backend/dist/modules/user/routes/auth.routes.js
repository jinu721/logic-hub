"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
function authRoutes(container) {
    const router = (0, express_1.Router)();
    const authController = container.authCtrl;
    router.post(_constants_1.AUTH_ROUTES.REGISTER, authController.register.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.VERIFY_OTP, authController.verifyOTP.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.LOGIN, authController.login.bind(authController));
    router.get(_constants_1.AUTH_ROUTES.VERIFY_LOGIN, authController.verifyLogin.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.FORGOT_PASSWORD, authController.forgotPassword.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.RESET_PASSWORD, authController.resetPassword.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.REFRESH_TOKEN, authController.refreshToken.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.CHANGE_PASSWORD, _middlewares_1.authMiddleware, authController.changePassword.bind(authController));
    router.get(_constants_1.AUTH_ROUTES.ME, _middlewares_1.authMiddleware, authController.getMe.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.LOGOUT, _middlewares_1.authMiddleware, authController.logout.bind(authController));
    router.post(_constants_1.AUTH_ROUTES.CLEAR_COOKIES, authController.clearCookies.bind(authController));
    router.get(_constants_1.AUTH_ROUTES.GOOGLE, passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
    router.get(_constants_1.AUTH_ROUTES.GOOGLE_CALLBACK, passport_1.default.authenticate("google", { failureRedirect: _constants_1.AUTH_ROUTES.REGISTER, session: false }), authController.googleAuthCallback.bind(authController));
    router.get(_constants_1.AUTH_ROUTES.GITHUB, passport_1.default.authenticate("github", { scope: ["user:email"], session: false }));
    router.get(_constants_1.AUTH_ROUTES.GITHUB_CALLBACK, passport_1.default.authenticate("github", { failureRedirect: _constants_1.AUTH_ROUTES.REGISTER, session: false }), authController.githubAuthCallback.bind(authController));
    return router;
}
