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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToAllUsers = void 0;
const redis_config_1 = __importDefault(require("../../../config/redis.config"));
const notification_1 = require("../../../modules/notification");
const sendNotificationToAllUsers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ io, container, type, title, message, data, socketEvent }) {
    try {
        const { users } = yield container.userQuerySvc.findUsers("", 1, 1000);
        console.log(`type : ${type} , title : ${title} , message : ${message} , data : ${data}`);
        for (const user of users) {
            const sockets = yield redis_config_1.default.sMembers(`sockets:${user.userId}`);
            if (sockets && sockets.length > 0) {
                for (const socketId of sockets) {
                    io.to(socketId).emit(socketEvent, { type, title, message, data });
                }
                const notificationDto = new notification_1.CreateNotificationDto();
                notificationDto.userId = user.userId;
                notificationDto.title = title;
                notificationDto.message = message;
                notificationDto.type = type;
                yield container.notificationSvc.createNotification(notificationDto);
            }
        }
    }
    catch (error) {
        console.error(`Error sending ${type} notifications`, error);
    }
});
exports.sendNotificationToAllUsers = sendNotificationToAllUsers;
