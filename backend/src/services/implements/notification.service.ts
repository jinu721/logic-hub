import { INotificationService } from "../interfaces/notification.service.interface";
import { NotificationIF } from "../../types/notification.type";
import {
  PublicNotificationDTO,
  toPublicNotificationDTO,
  toPublicNotificationDTOs,
} from "../../mappers/notification.dto";
import { INotificationRepository } from "../../repository/interfaces/notification.repository.interface";

export class NotificationService implements INotificationService {
  constructor(private readonly _notifyRep: INotificationRepository) {}

  private toDTO(notification: NotificationIF): PublicNotificationDTO {
    return toPublicNotificationDTO(notification);
  }

  private toDTOs(notifications: NotificationIF[]): PublicNotificationDTO[] {
    return toPublicNotificationDTOs(notifications);
  }

  async create(data: Partial<NotificationIF>): Promise<PublicNotificationDTO> {
    const notification = await this._notifyRep.createNotification(data);
    return this.toDTO(notification);
  }

  async getAll(): Promise<PublicNotificationDTO[]> {
    const notifications = await this._notifyRep.getAllNotifications();
    return this.toDTOs(notifications);
  }

  async getById(id: string): Promise<PublicNotificationDTO | null> {
    const notification = await this._notifyRep.getNotificationById(id);
    return notification ? this.toDTO(notification) : null;
  }

  async update(
    id: string,
    data: Partial<NotificationIF>
  ): Promise<PublicNotificationDTO | null> {
    const updated = await this._notifyRep.updateNotification(id, data);
    return updated ? this.toDTO(updated) : null;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this._notifyRep.markAllAsRead(userId);
  }

  async deleteAll(userId: string): Promise<boolean> {
    return this._notifyRep.deleteAllNotifications(userId);
  }

  async delete(id: string): Promise<boolean> {
    return await this._notifyRep.deleteNotification(id);
  }

  async getNotificationByUserId(
    userId: string
  ): Promise<PublicNotificationDTO[] | null> {
    const notifications = await this._notifyRep.getNotificationByUser(userId);
    return notifications ? this.toDTOs(notifications) : null;
  }
}
