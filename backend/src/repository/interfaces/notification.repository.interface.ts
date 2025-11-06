import { Types, UpdateQuery } from "mongoose";
import { NotificationIF } from "../../shared/types/notification.type"; 

export interface INotificationRepository {
  createNotification(data: Partial<NotificationIF>): Promise<NotificationIF>;
  getAllNotifications(): Promise<NotificationIF[]>;
  getNotificationById(id: Types.ObjectId): Promise<NotificationIF | null>;
  updateNotification(id: Types.ObjectId, update: UpdateQuery<NotificationIF>): Promise<NotificationIF | null>;
  deleteNotification(id: Types.ObjectId): Promise<boolean>;
  getNotificationByUser(id: Types.ObjectId): Promise<NotificationIF[] | null>;
  markAllAsRead(userId: Types.ObjectId): Promise<boolean>;
  deleteAllNotifications(userId: Types.ObjectId): Promise<boolean>;
}
