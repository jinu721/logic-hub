import { PublicNotificationDTO, CreateNotificationDto, UpdateNotificationDto } from "@modules/notification/dtos";
import { NotificationDocument } from "@shared/types";

export interface INotificationService {
  createNotification(data: CreateNotificationDto): Promise<PublicNotificationDTO>;
  getAllNotifications(): Promise<PublicNotificationDTO[]>;
  getNotificationById(id: string): Promise<PublicNotificationDTO>;
  updateNotification(id: string, data: UpdateNotificationDto): Promise<PublicNotificationDTO>;
  deleteNotification(id: string): Promise<boolean>;
  getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[]>;
  markAllAsRead(userId: string): Promise<boolean>;
  deleteAllNotification(userId: string): Promise<boolean>;
}
