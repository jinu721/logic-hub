import { INotificationService } from "../interfaces/notification.service.interface";
import { NotificationIF } from "../../types/notification.type";
import { NotificationRepository } from "../../repository/implements/notification.repository";
import { PublicNotificationDTO, toPublicNotificationDTO, toPublicNotificationDTOs } from "../../mappers/notification.dto";

export class NotificationService implements INotificationService {
  constructor(private notificationRepo: NotificationRepository) {}

  async create(data: Partial<NotificationIF>): Promise<PublicNotificationDTO> {
    const notification = await this.notificationRepo.createNotification(data);
    return toPublicNotificationDTO(notification)
  }

  async getAll(): Promise<PublicNotificationDTO[]> {
    const notifications = await this.notificationRepo.getAllNotifications();
    return toPublicNotificationDTOs(notifications);
  }

  async getById(id: string): Promise<PublicNotificationDTO | null> {
    const notification = await this.notificationRepo.getNotificationById(id);
    return toPublicNotificationDTO(notification as NotificationIF);
  }

  async update(id: string, data: Partial<PublicNotificationDTO>): Promise<PublicNotificationDTO | null> {
    const updated = await this.notificationRepo.updateNotification(id, data);
    return toPublicNotificationDTO(updated as NotificationIF);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this.notificationRepo.markAllAsRead(userId);
  }

  deleteAll(userId: string): Promise<boolean> { 
    return this.notificationRepo.deleteAllNotifications(userId);
  }

  async delete(id: string): Promise<boolean> {
    return await this.notificationRepo.deleteNotification(id);
  }

  async getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[] | null> {
    const notifications = await this.notificationRepo.getNotificationByUser(userId);
    return toPublicNotificationDTOs(notifications as NotificationIF[]);
  }
}
