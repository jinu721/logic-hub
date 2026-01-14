"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieOptions = void 0;
const env_1 = require("../../../config/env");
const getCookieOptions = (maxAge) => (Object.assign({ httpOnly: true, secure: env_1.env.NODE_ENV === "production", sameSite: (env_1.env.NODE_ENV === "production" ? "none" : "lax"), domain: undefined, path: "/" }, (maxAge ? { maxAge } : {})));
exports.getCookieOptions = getCookieOptions;
