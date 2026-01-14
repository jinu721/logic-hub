"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = void 0;
const mongoose_1 = require("mongoose");
const GroupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    image: String,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    admins: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    groupType: {
        type: String,
        enum: ['public-open', 'public-approval'],
        required: true,
        default: 'public-open',
    },
    category: {
        type: String,
        default: 'General',
    },
    tags: [
        {
            type: String,
        },
    ],
    userRequests: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    voiceRoom: {
        topic: { type: String },
        scheduledFor: { type: Date },
        durationMinutes: { type: Number },
        isActive: { type: Boolean, default: false },
        host: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        startAt: { type: Date },
        endAt: { type: Date },
        participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        mutedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
exports.GroupModel = (0, mongoose_1.model)('Group', GroupSchema);
