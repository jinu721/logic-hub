import express from "express";
import { NotificationController } from "../controllers/implements/notification.controller";
import { NotificationService } from "../services/implements/notification.service";
import { NotificationRepository } from "../repository/implements/notification.repository";
import { UserService } from "../services/implements/user.service";
import { UserRepository } from "../repository/implements/user.repository";
import { OTPServices } from "../services/implements/otp.service";
import { OtpRepository } from "../repository/implements/otp.repository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";

const router = express.Router();

const notificationController = new NotificationController(
  new NotificationService(new NotificationRepository()),
  new UserService(new UserRepository(), new OTPServices(new OtpRepository()), new ChallengeProgressRepository())
);

router.use(authMiddleware);

router.post("/", notificationController.createNotification.bind(notificationController));
router.get("/", notificationController.getAllNotifications.bind(notificationController));
router.get("/:id", notificationController.getNotificationById.bind(notificationController));
router.put("/:id", notificationController.updateNotification.bind(notificationController));
router.delete("/:id", notificationController.deleteNotification.bind(notificationController));
router.get("/user/me", notificationController.getNotificationByUser.bind(notificationController));
router.post("/mark/all", notificationController.markAllAsRead.bind(notificationController));
router.delete("/delete/all/:userId", notificationController.deleteAllNotifications.bind(notificationController));
router.patch("/toggle/user", notificationController.toggleUserNotification.bind(notificationController));

export default router;
