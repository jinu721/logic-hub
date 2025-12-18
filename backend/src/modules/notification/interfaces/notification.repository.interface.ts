import { Types, UpdateQuery } from "mongoose";
import { NotificationDocument } from "@shared/types"; 

export interface INotificationRepository {
  createNotification(data: Partial<NotificationDocument>): Promise<NotificationDocument>;
  getAllNotifications(): Promise<NotificationDocument[]>;
  getNotificationById(id: Types.ObjectId): Promise<NotificationDocument | null>;
  updateNotification(id: Types.ObjectId, update: UpdateQuery<NotificationDocument>): Promise<NotificationDocument | null>;
  deleteNotification(id: Types.ObjectId): Promise<boolean>;
  getNotificationByUser(id: Types.ObjectId): Promise<NotificationDocument[] | null>;
  markAllAsRead(userId: Types.ObjectId): Promise<boolean>;
  deleteAllNotifications(userId: Types.ObjectId): Promise<boolean>;
}
