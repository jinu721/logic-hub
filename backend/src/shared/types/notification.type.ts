import { InventoryBase } from "./inventory.types";

export type NotificationItemData = InventoryBase | string | { [key: string]: unknown };

export interface NotificationAttrs {
  userId: string;
  title: string;
  message: string;
  itemData?: NotificationItemData;
  type: "domain" | "market" | "gift" | "system";
  isRead: boolean;
  createdAt: Date;
}


export interface NotificationDocument extends NotificationAttrs, Document {}