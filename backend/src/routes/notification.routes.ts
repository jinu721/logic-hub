import express from "express";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { NOTIFICATION_ROUTES } from "../shared/constants/ROUTES/notify.constants";
import { container } from "../di/types";

const router = express.Router();

const notificationController = container.notifyCtrl;

router.use(authMiddleware);

router.post(NOTIFICATION_ROUTES.BASE, notificationController.createNotification.bind(notificationController));
router.get(NOTIFICATION_ROUTES.BASE, notificationController.getAllNotifications.bind(notificationController));
router.get(NOTIFICATION_ROUTES.BY_ID, notificationController.getNotificationById.bind(notificationController));
router.put(NOTIFICATION_ROUTES.UPDATE, notificationController.updateNotification.bind(notificationController));
router.delete(NOTIFICATION_ROUTES.DELETE, notificationController.deleteNotification.bind(notificationController));
router.get(NOTIFICATION_ROUTES.USER_ME, notificationController.getNotificationByUser.bind(notificationController));
router.post(NOTIFICATION_ROUTES.MARK_ALL, notificationController.markAllAsRead.bind(notificationController));
router.delete(NOTIFICATION_ROUTES.DELETE_ALL, notificationController.deleteAllNotifications.bind(notificationController));
router.patch(NOTIFICATION_ROUTES.TOGGLE_USER, notificationController.toggleUserNotification.bind(notificationController));

export default router;
