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
exports.NotificationController = void 0;
const dtos_1 = require("../../notification/dtos");
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
class NotificationController {
    constructor(_notifySvc) {
        this._notifySvc = _notifySvc;
        this.createNotification = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateNotificationDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._notifySvc.createNotification(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, result, "Notification created successfully");
        }));
        this.getAllNotifications = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._notifySvc.getAllNotifications();
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Notifications fetched successfully");
        }));
        this.getNotificationById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetNotificationDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._notifySvc.getNotificationById(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Notification not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Notification fetched successfully");
        }));
        this.updateNotification = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateNotificationDto.from(Object.assign({ id: req.params.id }, req.body));
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._notifySvc.updateNotification(dto.id, dto);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Notification not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Notification updated successfully");
        }));
        this.deleteNotification = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteNotificationDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const result = yield this._notifySvc.deleteNotification(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Notification not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, { message: "Notification deleted successfully" });
        }));
        this.getNotificationByUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const result = yield this._notifySvc.getNotificationByUserId(userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "User notifications fetched successfully");
        }));
        this.markAllAsRead = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const result = yield this._notifySvc.markAllAsRead(userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "All notifications marked as read");
        }));
        this.deleteAllNotifications = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const result = yield this._notifySvc.deleteAllNotification(userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "All notifications deleted successfully");
        }));
    }
}
exports.NotificationController = NotificationController;
