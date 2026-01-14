"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["one-to-one", "group"]
    },
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
        default: null,
    },
    typingUsers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    seenBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    latestMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
    },
    unreadCounts: {
        type: Map,
        of: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.ConversationModel = (0, mongoose_1.model)('Conversation', ConversationSchema);
