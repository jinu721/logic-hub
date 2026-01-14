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
exports.NotificationRepository = void 0;
const notification_1 = require("../../notification");
const _core_1 = require("../../../shared/core");
const database_1 = require("../../../shared/utils/database");
class NotificationRepository extends _core_1.BaseRepository {
    constructor() {
        super(notification_1.NotificationModel);
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = new this.model(data);
            return yield notification.save();
        });
    }
    getAllNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLeanMany)(this.model.find().sort({ createdAt: -1 }));
        });
    }
    getNotificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findById(id));
        });
    }
    getNotificationByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLeanMany)(this.model.find({ userId }).sort({ createdAt: -1 }));
        });
    }
    updateNotification(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, database_1.toLean)(this.model.findByIdAndUpdate(id, update, { new: true }));
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.updateMany({ userId }, { isRead: true });
            return !!result;
        });
    }
    deleteAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deleteMany({ userId });
            return !!result;
        });
    }
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findByIdAndDelete(id);
            return result !== null;
        });
    }
}
exports.NotificationRepository = NotificationRepository;
