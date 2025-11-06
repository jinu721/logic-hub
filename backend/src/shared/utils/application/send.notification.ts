
import redisClient from "@config/redis.config";
import { container } from "@di";


interface SendNotificationParams {
  io: any;
  container: any;
  type: string;
  title: string;
  message: string;
  data: any;
  socketEvent: string;
}
  
export const sendNotificationToAllUsers = async ({ io, container, type, title, message, data, socketEvent }: SendNotificationParams) => {
    try {
      const users = await container.userSvc.findUsers();
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
  
  