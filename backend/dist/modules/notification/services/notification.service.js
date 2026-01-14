"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const notification_1 = require("../../notification");
const application_2 = require("../../../shared/utils/application");
class NotificationService extends _core_1.BaseService {
    constructor(notifyRepo) {
        super();
        this.notifyRepo = notifyRepo;
    }
    toDTO(entity) {
        return (0, notification_1.toPublicNotificationDTO)(entity);
    }
    toDTOs(entities) {
        return (0, notification_1.toPublicNotificationDTOs)(entities);
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert DTO to document data
            const notificationData = {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type,
                itemData: data.itemData,
                isRead: false
            };
            const notification = yield this.notifyRepo.createNotification(notificationData);
            return this.mapOne(notification);
        });
    }
    getAllNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notifyRepo.getAllNotifications();
            return this.mapMany(notifications);
        });
    }
    getNotificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.notifyRepo.getNotificationById((0, application_2.toObjectId)(id));
            if (!notification) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Notification not found");
            }
            return this.mapOne(notification);
        });
    }
    updateNotification(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert DTO to document data
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.title && { title: data.title })), (data.message && { message: data.message })), (data.type && { type: data.type })), (data.itemData !== undefined && { itemData: data.itemData })), (data.isRead !== undefined && { isRead: data.isRead }));
            const updated = yield this.notifyRepo.updateNotification((0, application_2.toObjectId)(id), updateData);
            if (!updated) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Notification not found");
            }
            return this.mapOne(updated);
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notifyRepo.markAllAsRead((0, application_2.toObjectId)(userId));
        });
    }
    deleteAllNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notifyRepo.deleteAllNotifications((0, application_2.toObjectId)(userId));
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notifyRepo.deleteNotification((0, application_2.toObjectId)(id));
        });
    }
    getNotificationByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.notifyRepo.getNotificationByUser((0, application_2.toObjectId)(userId));
            return this.mapMany(notifications);
        });
    }
}
exports.NotificationService = NotificationService;
