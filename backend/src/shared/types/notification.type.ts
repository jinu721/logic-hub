import { InventoryAttrs } from "./inventory.types";

export type NotificationItemData = InventoryAttrs | string | { [key: string]: unknown };

export interface NotificationAttrs {
  userId: string;
  title: string;
  message: string;
  itemData?: NotificationItemData;
  type: "domain" | "market" | "gift" | "system";
  isRead: boolean;
  createdAt: Date;
}
