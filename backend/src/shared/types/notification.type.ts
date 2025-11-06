import { Document } from "mongoose";

export interface NotificationIF extends Document {
  userId: string;
  title: string;
  message: string;
  itemData?: any;
  type: "domain" | "market" | "gift" | "system";
  isRead: boolean;
  createdAt: Date;
}
