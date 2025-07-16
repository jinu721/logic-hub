import { UpdateQuery } from "mongoose";
import { INotificationRepository } from "../interfaces/notification.repository.interface";
import { NotificationModel } from "../../models/notification.model";
import { NotificationIF } from "../../types/notification.type"; 
import { BaseRepository } from "../base.repository";

export class NotificationRepository extends BaseRepository<NotificationIF> implements INotificationRepository {

    constructor() {
        super(NotificationModel);
    }
  async createNotification(data: Partial<NotificationIF>): Promise<NotificationIF> {
    return await this.model.create(data);
  }

  async getAllNotifications(): Promise<NotificationIF[]> {
    return await this.model.find().sort({ createdAt: -1 });
  }

  async getNotificationById(id: string): Promise<NotificationIF | null> {
    return await this.model.findById(id);
  }

  async getNotificationByUser(id: string): Promise<NotificationIF[] | null> {
    return await this.model.find({ userId: id }).sort({ createdAt: -1 });
  }

  async updateNotification(id: string, update: UpdateQuery<NotificationIF>): Promise<NotificationIF | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await this.model.updateMany({ userId }, { isRead: true });
    return !!result;
  }

  async deleteAllNotifications(userId:string): Promise<boolean> {
    const result = await this.model.deleteMany({userId});
    return !!result;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
