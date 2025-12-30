
import redisClient from "@config/redis.config";
import { Container } from "@di";
import { Server } from "socket.io";
import { CreateNotificationDto } from "@modules/notification";


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
        const notificationDto = new CreateNotificationDto();
        notificationDto.userId = user.userId;
        notificationDto.title = title;
        notificationDto.message = message;
        notificationDto.type = type;
        await container.notificationSvc.createNotification(notificationDto);
      }
    }
  } catch (error) {
    console.error(`Error sending ${type} notifications`, error);
  }
};
