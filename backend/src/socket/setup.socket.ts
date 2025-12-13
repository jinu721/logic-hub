import { Server } from "socket.io";
import { ExtendedSocket } from "@shared/types/socket.types";
import { MessageHandler } from "./socketHandlers/message.handler";
import { GroupHandler } from "./socketHandlers/group.handler";
import { NotificationHandler } from "./socketHandlers/notification.handler";
import { UserHandler } from "./socketHandlers/user.handler";
import { Container } from "@di";

export const setupSocket = (io: Server,container: Container) => {
  const messageHandler = new MessageHandler(io,container);
  const groupHandler = new GroupHandler(io,container);
  const notificationHandler = new NotificationHandler(io,container);
  const userHandler = new UserHandler(io,container);

  io.on("connection", (socket: ExtendedSocket) => {
    messageHandler.setupMessageHandlers(socket);
    groupHandler.setupGroupHandlers(socket);
    notificationHandler.setupNotificationHandlers(socket);
    userHandler.setupUserHandlers(socket);
  });
};