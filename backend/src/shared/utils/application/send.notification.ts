
import redisClient from "@config/redis.config";
import { Container } from "@di";
import { Server } from "socket.io";


interface SendNotificationParams<T> {
  io: Server;
  container: Container;
  type: string;
  title: string;
  message: string;
  data: T;
  socketEvent: string;
}

export const sendNotificationToAllUsers = async <T>({ io, container, type, title, message, data, socketEvent }: SendNotificationParams<T>) => {
  try {
    const { users } = await container.userQuerySvc.findUsers("", 1, 1000);
    console.log(`type : ${type} , title : ${title} , message : ${message} , data : ${data}`);
    for (const user of users) {
      const sockets = await redisClient.sMembers(`sockets:${user.userId}`);
      if (sockets && sockets.length > 0) {
        for (const socketId of sockets) {
          io.to(socketId).emit(socketEvent, { type, title, message, data });
        }
        await container.notificationSvc.createNotification({
          userId: user.userId as any,
          title,
          message,
          type: type as any,
        } as any);
      }
    }
  } catch (error) {
    console.error(`Error sending ${type} notifications`, error);
  }
};
