import { Server } from "socket.io";
import { ExtendedSocket } from "../../types/socket.types";
import { AppContainer } from "../../utils/socket/app.container";
import { sendNotificationToAllUsers } from "../../utils/application/send.notification";
import redisClient from "../../config/redis.config";

export class NotificationHandler {
  constructor(private io: Server) {}

  public setupNotificationHandlers(socket: ExtendedSocket): void {
    socket.on("admin_add_domain", this.handleAdminAddDomain.bind(this, socket));
    socket.on("admin_add_market_item", this.handleAdminAddMarketItem.bind(this, socket));
    socket.on("admin_gift_user", this.handleAdminGiftUser.bind(this, socket));
  }

  private async handleAdminAddDomain(
    socket: ExtendedSocket,
    domainData: any
  ): Promise<void> {
    await sendNotificationToAllUsers({
      io: this.io,
      type: "domain",
      title: "New Domain Opened",
      message: "Finish the domain and win exciting rewards!",
      data: domainData,
      socketEvent: "domain_notification",
    });
  }

  private async handleAdminAddMarketItem(
    socket: ExtendedSocket,
    marketData: any
  ): Promise<void> {
    await sendNotificationToAllUsers({
      io: this.io,
      type: "market",
      title: "New Market Item Available",
      message: "Check out the new items in the market!",
      data: marketData,
      socketEvent: "market_notification",
    });
  }

  private async handleAdminGiftUser(
    socket: ExtendedSocket,
    { item, userId }: { item: string; userId: string }
  ): Promise<void> {
    try {
      console.log("Hitting handleAdminGiftUser");
      console.log("userId", userId);
      const socketId = await redisClient.get(`socket:${userId}`);
      if (socketId) {
        this.io.to(socketId).emit("gift_notification", {
          userId: userId,
          itemData:item,
          title: "You've received a gift!",
          message: "An admin has sent you a special gift. Check it now!",
          type: "gift",
          isRead: false
        });
        await AppContainer.notificationService.create({
          userId: userId,
          title: "You've received a gift!",
          itemData:item,
          message: "An admin has sent you a special gift. Check it now!",
          type: "gift",
        });
      }
    } catch (err) {
      console.error("Error sending gift notification", err);
    }
  }
}