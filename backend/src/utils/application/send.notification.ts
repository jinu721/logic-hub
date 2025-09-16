
import redisClient from "../../config/redis.config";
import { container } from "../../di/container";


const userService = container.userSvc;
const notificationService = container.notifySvc;

export const sendNotificationToAllUsers = async ({ io, type, title, message, data, socketEvent }) => {
    try {
      const users = await userService.findUsers();
      console.log(`type : ${type} , title : ${title} , message : ${message} , data : ${data}`);
      for (const user of users) {
        const socketId = await redisClient.get(`socket:${user._id.toString()}`);
        if (socketId) {
          io.to(socketId).emit(socketEvent, { type, title, message, data });
          await notificationService.create({
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
  
  