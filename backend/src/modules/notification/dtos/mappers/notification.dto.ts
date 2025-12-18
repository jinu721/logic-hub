import { NotificationDocument } from "@shared/types";
import { PublicNotificationDTO } from "@modules/notification/dtos";

export const toPublicNotificationDTO = (
  notification: NotificationDocument
): PublicNotificationDTO => {
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

export const toPublicNotificationDTOs = (
  notifications: NotificationDocument[]
): PublicNotificationDTO[] => {
  return notifications.map(toPublicNotificationDTO);
};
