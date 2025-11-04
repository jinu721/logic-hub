import { PublicNotificationDTO } from "../../mappers/notification.dto";
import { NotificationIF } from "../../types/notification.type";

export interface INotificationService {
  createNotification(data: NotificationIF): Promise<PublicNotificationDTO>;
  getAllNotifications(): Promise<PublicNotificationDTO[]>;
  getNotificationById(id: string): Promise<PublicNotificationDTO>;
  updateNotification(id: string, data: Partial<PublicNotificationDTO>): Promise<PublicNotificationDTO>;
  deleteNotification(id: string): Promise<boolean>;
  getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[]>;
  markAllAsRead(userId: string): Promise<boolean>;
  deleteAllNotification(userId: string): Promise<boolean>;
}
