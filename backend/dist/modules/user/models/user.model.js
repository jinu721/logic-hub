"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const types_1 = require("../../../shared/types");
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    avatar: { type: mongoose_1.Schema.Types.ObjectId, ref: "Avatar", default: null },
    banner: { type: mongoose_1.Schema.Types.ObjectId, ref: "Banner" },
    password: { type: String },
    phoneNumber: { type: String, unique: true, sparse: true },
    twoFactorEnabled: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(types_1.UserRole), default: types_1.UserRole.USER },
    loginType: { type: String, enum: Object.values(types_1.LoginType), default: types_1.LoginType.NORMAL },
    googleId: { type: String },
    githubId: { type: String },
    stats: {
        xpPoints: { type: Number, default: 0 },
        totalXpPoints: { type: Number, default: 0, index: true },
        level: { type: Number, default: 1 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastSolvedDate: { type: Date },
    },
    inventory: {
        keys: { type: Number, default: 0 },
        badges: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Badge" }],
        ownedAvatars: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Avatar" }],
        ownedBanners: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Banner" }],
    },
    isBanned: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    membership: {
        planId: { type: mongoose_1.Schema.Types.ObjectId, ref: "PremiumPlan", default: null },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        type: { type: String, enum: ["silver", "gold"], default: null },
        isActive: { type: Boolean, default: false },
    },
    dailyRewardDay: { type: Number, default: 1 },
    lastRewardClaimDate: { type: Date, default: null },
    lastSeen: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    blockedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    timestamp: { type: Date, default: Date.now },
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
