
export interface NotificationIF {
  _id?: string;
  userId: string;
  itemData?: any;
  title: string;
  message: string;
  type: "domain" | "market" | "gift" | "system";
  isRead: boolean;
  createdAt: Date;
}
