import { PublicNotificationDTO } from "@modules/notification/dtos";
import { NotificationDocument } from "@shared/types";

export interface INotificationService {
  createNotification(data: NotificationDocument): Promise<PublicNotificationDTO>;
  getAllNotifications(): Promise<PublicNotificationDTO[]>;
  getNotificationById(id: string): Promise<PublicNotificationDTO>;
  updateNotification(id: string, data: Partial<PublicNotificationDTO>): Promise<PublicNotificationDTO>;
  deleteNotification(id: string): Promise<boolean>;
  getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[]>;
  markAllAsRead(userId: string): Promise<boolean>;
  deleteAllNotification(userId: string): Promise<boolean>;
}
