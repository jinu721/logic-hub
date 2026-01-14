"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'voice', 'poll', 'system', 'sticker'],
        required: true,
        default: 'text',
    },
    mentionedUsers: [
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
    media: {
        url: String,
        type: {
            type: String,
            enum: ['image', 'video', 'audio', 'document', 'voice', 'sticker'],
        },
    },
    reactions: [
        {
            emoji: String,
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        },
    ],
    replyTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.MessageModel = (0, mongoose_1.model)('Message', MessageSchema);
