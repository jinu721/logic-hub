import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicNotificationDTO,
  toPublicNotificationDTO,
  toPublicNotificationDTOs,
  INotificationService, 
  INotificationRepository,
  CreateNotificationDto,
  UpdateNotificationDto
} from "@modules/notification";

import { NotificationDocument, NotificationItemData } from "@shared/types";
import { toObjectId } from "@utils/application";


export class NotificationService
  extends BaseService<NotificationDocument, PublicNotificationDTO>
  implements INotificationService
{
  constructor(private readonly notifyRepo: INotificationRepository) {
    super()
  }

  protected toDTO(entity: NotificationDocument): PublicNotificationDTO {
    return toPublicNotificationDTO(entity)
  }

  protected toDTOs(entities: NotificationDocument[]): PublicNotificationDTO[] {
    return toPublicNotificationDTOs(entities)
  }

  async createNotification(data: CreateNotificationDto): Promise<PublicNotificationDTO> {
    // Convert DTO to document data
    const notificationData = {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type as "system" | "domain" | "market" | "gift",
      itemData: data.itemData as NotificationItemData,
      isRead: false
    };
    
    const notification = await this.notifyRepo.createNotification(notificationData)
    return this.mapOne(notification)
  }

  async getAllNotifications(): Promise<PublicNotificationDTO[]> {
    const notifications = await this.notifyRepo.getAllNotifications()
    return this.mapMany(notifications)
  }

  async getNotificationById(id: string): Promise<PublicNotificationDTO> {
    const notification = await this.notifyRepo.getNotificationById(toObjectId(id))
    if (!notification) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found")
    }
    return this.mapOne(notification)
  }

  async updateNotification(id: string, data: UpdateNotificationDto): Promise<PublicNotificationDTO> {
    // Convert DTO to document data
    const updateData = {
      ...(data.title && { title: data.title }),
      ...(data.message && { message: data.message }),
      ...(data.type && { type: data.type as "system" | "domain" | "market" | "gift" }),
      ...(data.itemData !== undefined && { itemData: data.itemData }),
      ...(data.isRead !== undefined && { isRead: data.isRead })
    };
    
    const updated = await this.notifyRepo.updateNotification(toObjectId(id), updateData)
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Notification not found")
    }
    return this.mapOne(updated)
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    return await this.notifyRepo.markAllAsRead(toObjectId(userId))
  }

  async deleteAllNotification(userId: string): Promise<boolean> {
    return await this.notifyRepo.deleteAllNotifications(toObjectId(userId))
  }

  async deleteNotification(id: string): Promise<boolean> {
    return await this.notifyRepo.deleteNotification(toObjectId(id))
  }

  async getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[]> {
    const notifications = await this.notifyRepo.getNotificationByUser(toObjectId(userId))
    return this.mapMany(notifications)
  }
}
