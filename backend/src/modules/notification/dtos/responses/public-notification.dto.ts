import { NotificationItemData } from "@shared/types";

export interface PublicNotificationDTO {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "domain" | "market" | "gift" | "system";
  itemData?: NotificationItemData;
  isRead: boolean;
  createdAt: Date;
}
