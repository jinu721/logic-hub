"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    itemData: { type: mongoose_1.Schema.Types.Mixed },
    type: {
        type: String,
        enum: ['domain', 'market', 'gift', 'system'],
        required: true
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
exports.NotificationModel = (0, mongoose_1.model)('Notification', notificationSchema);
