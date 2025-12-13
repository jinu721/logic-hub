
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
      const users = await container.userQuerySvc.findUsers();
      console.log(`type : ${type} , title : ${title} , message : ${message} , data : ${data}`);
      for (const user of users) {
        const socketId = await redisClient.get(`socket:${user._id.toString()}`);
        if (socketId) {
          io.to(socketId).emit(socketEvent, { type, title, message, data });
          await container.notifySvc.create({
            userId: user._id.toString(),
            title,
            message,
            type,
          });
        }
      }
    } catch (error) {
      console.error(`Error sending ${type} notifications`, error);
    }
  };
  
  