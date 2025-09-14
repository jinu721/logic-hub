
import { OtpRepository } from "../../repository/implements/otp.repository";
import { UserRepository } from "../../repository/implements/user.repository";
import { OTPServices } from "../../services/implements/otp.service";
import { UserService } from "../../services/implements/user.service";
import redisClient from "../../config/redis.config";
import { NotificationService } from "../../services/implements/notification.service";
import { NotificationRepository } from "../../repository/implements/notification.repository";


const userService = new UserService(
  new UserRepository(),
  new OTPServices(new OtpRepository())
);

const notificationService = new NotificationService(
  new NotificationRepository()
)

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
  
  