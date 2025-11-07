export interface PublicNotificationDTO {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "domain" | "market" | "gift" | "system";
  itemData?: any;
  isRead: boolean;
  createdAt: Date;
}
