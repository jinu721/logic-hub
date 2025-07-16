import { Server } from "socket.io";
import { ExtendedSocket } from "../types/socket.types";
import { MessageHandler } from "./socketHandlers/message.handler";
import { GroupHandler } from "./socketHandlers/group.handler";
import { NotificationHandler } from "./socketHandlers/notification.handler";
import { UserHandler } from "./socketHandlers/user.handler";

export const setupSocket = (io: Server) => {
  const messageHandler = new MessageHandler(io);
  const groupHandler = new GroupHandler(io);
  const notificationHandler = new NotificationHandler(io);
  const userHandler = new UserHandler(io);

  io.on("connection", (socket: ExtendedSocket) => {
    messageHandler.setupMessageHandlers(socket);
    groupHandler.setupGroupHandlers(socket);
    notificationHandler.setupNotificationHandlers(socket);
    userHandler.setupUserHandlers(socket);
  });
};