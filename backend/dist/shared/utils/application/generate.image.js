"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignedImageUrl = void 0;
const cloudinary_config_1 = __importDefault(require("../../../config/cloudinary.config"));
const generateSignedImageUrl = (publicId, options = {}) => {
    return cloudinary_config_1.default.v2.url(publicId, Object.assign({ type: "authenticated", sign_url: true, secure: true, expires_at: Math.floor(Date.now() / 1000) + 60 * 10 }, options));
};
exports.generateSignedImageUrl = generateSignedImageUrl;
