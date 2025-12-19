
import { Types, UpdateQuery } from "mongoose";
import { INotificationRepository, NotificationModel } from "@modules/notification";
import { NotificationDocument } from "@shared/types";
import { BaseRepository } from "@core";
import { toLean, toLeanMany } from "@utils/database";


export class NotificationRepository
  extends BaseRepository<NotificationDocument>
  implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  }

  async createNotification(data: Partial<NotificationDocument>): Promise<NotificationDocument> {
    const notification = new this.model(data);
    return await notification.save();
  }

  async getAllNotifications(): Promise<NotificationDocument[]> {
    return toLeanMany<NotificationDocument>(
      this.model.find().sort({ createdAt: -1 })
    );
  }

  async getNotificationById(id: Types.ObjectId): Promise<NotificationDocument | null> {
    return toLean<NotificationDocument>(this.model.findById(id));
  }

  async getNotificationByUser(userId: Types.ObjectId): Promise<NotificationDocument[]> {
    return toLeanMany<NotificationDocument>(
      this.model.find({ userId }).sort({ createdAt: -1 })
    );
  }

  async updateNotification(
    id: Types.ObjectId,
    update: UpdateQuery<NotificationDocument>
  ): Promise<NotificationDocument | null> {
    return toLean<NotificationDocument>(
      this.model.findByIdAndUpdate(id, update, { new: true })
    );
  }

  async markAllAsRead(userId: Types.ObjectId): Promise<boolean> {
    const result = await this.updateMany({ userId }, { isRead: true });
    return !!result;
  }

  async deleteAllNotifications(userId: Types.ObjectId): Promise<boolean> {
    const result = await this.deleteMany({ userId });
    return !!result;
  }

  async deleteNotification(id: Types.ObjectId): Promise<boolean> {
    const result = await this.findByIdAndDelete(id);
    return result !== null;
  }
}
