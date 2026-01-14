"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicNotificationDTOs = exports.toPublicNotificationDTO = void 0;
const toPublicNotificationDTO = (notification) => {
    return {
        _id: notification._id ? notification._id.toString() : '',
        userId: notification.userId.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        itemData: notification.itemData,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
    };
};
exports.toPublicNotificationDTO = toPublicNotificationDTO;
const toPublicNotificationDTOs = (notifications) => {
    return notifications.map(exports.toPublicNotificationDTO);
};
exports.toPublicNotificationDTOs = toPublicNotificationDTOs;
