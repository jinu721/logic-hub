import { PublicNotificationDTO } from "../../mappers/notification.dto";
import { NotificationIF } from "../../types/notification.type";

export interface INotificationService {
  create(data: Partial<NotificationIF>): Promise<PublicNotificationDTO>;
  getAll(): Promise<PublicNotificationDTO[]>;
  getById(id: string): Promise<PublicNotificationDTO | null>;
  update(id: string, data: Partial<PublicNotificationDTO>): Promise<PublicNotificationDTO | null>;
  delete(id: string): Promise<boolean>;
  getNotificationByUserId(userId: string): Promise<PublicNotificationDTO[] | null>;
  markAllAsRead(userId: string): Promise<boolean>;
  deleteAll(userId: string): Promise<boolean>;
}
