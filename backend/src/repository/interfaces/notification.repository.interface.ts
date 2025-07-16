import { UpdateQuery } from "mongoose";
import { NotificationIF } from "../../types/notification.type"; 

export interface INotificationRepository {
  createNotification(data: Partial<NotificationIF>): Promise<NotificationIF>;
  getAllNotifications(): Promise<NotificationIF[]>;
  getNotificationById(id: string): Promise<NotificationIF | null>;
  updateNotification(id: string, update: UpdateQuery<NotificationIF>): Promise<NotificationIF | null>;
  deleteNotification(id: string): Promise<boolean>;
  getNotificationByUser(id: string): Promise<NotificationIF[] | null>;
  markAllAsRead(userId: string): Promise<boolean>;
  deleteAllNotifications(userId:string): Promise<boolean>;
}
