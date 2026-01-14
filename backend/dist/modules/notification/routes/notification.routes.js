"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const notificationRoutes = (container) => {
    const router = express_1.default.Router();
    const notificationController = container.notificationCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.NOTIFICATION_ROUTES.BASE, notificationController.createNotification.bind(notificationController));
    router.get(_constants_1.NOTIFICATION_ROUTES.BASE, notificationController.getAllNotifications.bind(notificationController));
    router.get(_constants_1.NOTIFICATION_ROUTES.BY_ID, notificationController.getNotificationById.bind(notificationController));
    router.put(_constants_1.NOTIFICATION_ROUTES.UPDATE, notificationController.updateNotification.bind(notificationController));
    router.delete(_constants_1.NOTIFICATION_ROUTES.DELETE, notificationController.deleteNotification.bind(notificationController));
    router.get(_constants_1.NOTIFICATION_ROUTES.USER_ME, notificationController.getNotificationByUser.bind(notificationController));
    router.post(_constants_1.NOTIFICATION_ROUTES.MARK_ALL, notificationController.markAllAsRead.bind(notificationController));
    router.delete(_constants_1.NOTIFICATION_ROUTES.DELETE_ALL, notificationController.deleteAllNotifications.bind(notificationController));
    return router;
};
exports.notificationRoutes = notificationRoutes;
