import { UserDocument } from "@shared/types";
import { Schema, model } from "mongoose";


const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  avatar: { type: Schema.Types.ObjectId, ref: "Avatar", default: null },
  banner: { type: Schema.Types.ObjectId, ref: "Banner" },
  password: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true },
  twoFactorEnabled: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
  loginType: { type: String, enum: ["normal", "google", "github"], default: "normal" },
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
    badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
    ownedAvatars: [{ type: Schema.Types.ObjectId, ref: "Avatar" }],
    ownedBanners: [{ type: Schema.Types.ObjectId, ref: "Banner" }],
  },
  isBanned: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  membership: {
    planId: { type: Schema.Types.ObjectId, ref: "PremiumPlan", default: null },
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
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  timestamp: { type: Date, default: Date.now },
} as any);


export const UserModel = model<UserDocument>('User', UserSchema);