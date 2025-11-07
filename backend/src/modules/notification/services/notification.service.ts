import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicNotificationDTO,
  toPublicNotificationDTO,
  toPublicNotificationDTOs,
  INotificationService, 
  INotificationRepository
} from "@modules/notification";

import { NotificationIF } from "@shared/types";
import { toObjectId } from "@utils/application";


export class NotificationService
  extends BaseService<NotificationIF, PublicNotificationDTO>
  implements INotificationService
{
  constructor(private readonly notifyRepo: INotificationRepository) {
    super()
  }

  protected toDTO(entity: NotificationIF): PublicNotificationDTO {
    return toPublicNotificationDTO(entity)
  }

  protected toDTOs(entities: NotificationIF[]): PublicNotificationDTO[] {
    return toPublicNotificationDTOs(entities)
  }

  async createNotification(data: Partial<NotificationIF>): Promise<PublicNotificationDTO> {
    const notification = await this.notifyRepo.createNotification(data)
    return this.mapOne(notification)
  }

  async getAllNotifications(): Promise<PublicNotificationDTO[]> {
    const notifications = await this.notifyRepo.getAllNotifications()
    return this.mapMany(notifications)
  }

  async getById(id: string): Promise<PublicNotificationDTO> {
    const notification = await this.notifyRepo.getNotificationById(toObjectId(id))
    if (!notification) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found")
    }
    return this.mapOne(notification)
  }

  async update(id: string, data: Partial<NotificationIF>): Promise<PublicNotificationDTO> {
    const updated = await this.notifyRepo.updateNotification(toObjectId(id), data)
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found")
    }
    return this.mapOne(updated)
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this.notifyRepo.markAllAsRead(toObjectId(userId))
  }

  async deleteAll(userId: string): Promise<boolean> {
    return await this.notifyRepo.deleteAllNotifications(toObjectId(userId))
  }

  async delete(id: string): Promise<boolean> {
    return await this.notifyRepo.deleteNotification(toObjectId(id))
  }

  async getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[]> {
    const notifications = await this.notifyRepo.getNotificationByUser(toObjectId(userId))
    return this.mapMany(notifications)
  }
}
