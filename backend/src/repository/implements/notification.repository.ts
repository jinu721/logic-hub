import { Types, UpdateQuery } from "mongoose";
import { INotificationRepository } from "../interfaces/notification.repository.interface";
import { NotificationModel } from "../../models/notification.model";
import { NotificationIF } from "../../types/notification.type";
import { BaseRepository } from "../base.repository";
import {
  toLean,
  toLeanMany,
} from "../../utils/database/query.utils";

export class NotificationRepository
  extends BaseRepository<NotificationIF>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async createNotification(data: Partial<NotificationIF>): Promise<NotificationIF> {
    const notification = new this.model(data);
    return toLean<NotificationIF>(notification.save());
  }

  async getAllNotifications(): Promise<NotificationIF[]> {
    return toLeanMany<NotificationIF>(
      this.model.find().sort({ createdAt: -1 })
    );
  }

  async getNotificationById(id: Types.ObjectId): Promise<NotificationIF | null> {
    return toLean<NotificationIF>(this.model.findById(id));
  }

  async getNotificationByUser(id: Types.ObjectId): Promise<NotificationIF[]> {
    return toLeanMany<NotificationIF>(
      this.model.find({ userId: id }).sort({ createdAt: -1 })
    );
  }

  async updateNotification(
    id: Types.ObjectId,
    update: UpdateQuery<NotificationIF>
  ): Promise<NotificationIF | null> {
    return toLean<NotificationIF>(
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
