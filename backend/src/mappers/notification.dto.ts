import { NotificationIF } from "../shared/types/notification.type";

export interface PublicNotificationDTO {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "domain" | "market" | "gift" | "system";
  itemData?: any;
  isRead: boolean;
  createdAt: Date;
}



export const toPublicNotificationDTO = (
  notification: NotificationIF
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
  notifications: NotificationIF[]
): PublicNotificationDTO[] => {
  return notifications.map(toPublicNotificationDTO);
};
