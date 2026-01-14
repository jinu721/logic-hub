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
exports.setupPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const env_1 = require("./env");
const types_1 = require("../shared/types");
const application_1 = require("../shared/utils/application");
const _constants_1 = require("../shared/constants");
const logger_1 = __importDefault(require("../shared/utils/application/logger"));
const setupPassport = (container) => {
    const authService = container.authSrv;
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    }, (req, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
            if (!email) {
                logger_1.default.error(`Google Login Failed: No email provided for profile ${profile.id}`);
                return done(new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Google did not provide an email."));
            }
            const user = yield authService.socialLogin({
                email,
                name: profile.displayName || profile.username || "unknown",
                profileId: profile.id,
                loginType: types_1.LoginType.GOOGLE
            });
            return done(null, user);
        }
        catch (e) {
            return done(e);
        }
    })));
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: env_1.env.GITHUB_CLIENT_ID,
        clientSecret: env_1.env.GITHUB_CLIENT_SECRET,
        callbackURL: env_1.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
        passReqToCallback: true
    }, (req, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
            if (!email) {
                logger_1.default.error(`GitHub Login Failed: No email provided for profile ${profile.id}`);
                return done(new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "GitHub did not provide an email."));
            }
            const user = yield authService.socialLogin({
                email,
                name: profile.displayName || profile.username || "unknown",
                profileId: profile.id,
                loginType: types_1.LoginType.GITHUB
            });
            return done(null, user);
        }
        catch (e) {
            return done(e);
        }
    })));
};
exports.setupPassport = setupPassport;
