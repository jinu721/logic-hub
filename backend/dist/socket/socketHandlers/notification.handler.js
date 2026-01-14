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
exports.NotificationHandler = void 0;
const send_notification_1 = require("../../shared/utils/application/send.notification");
const redis_config_1 = __importDefault(require("../../config/redis.config"));
const dtos_1 = require("../../modules/notification/dtos");
class NotificationHandler {
    constructor(io, container) {
        this.io = io;
        this.container = container;
    }
    setupNotificationHandlers(socket) {
        socket.on("admin_add_domain", this.handleAdminAddDomain.bind(this, socket));
        socket.on("admin_add_market_item", this.handleAdminAddMarketItem.bind(this, socket));
        socket.on("admin_gift_user", this.handleAdminGiftUser.bind(this, socket));
    }
    handleAdminAddDomain(socket, domainData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, send_notification_1.sendNotificationToAllUsers)({
                io: this.io,
                container: this.container,
                type: "domain",
                title: "New Domain Opened",
                message: "Finish the domain and win exciting rewards!",
                data: domainData,
                socketEvent: "domain_notification",
            });
        });
    }
    handleAdminAddMarketItem(socket, marketData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, send_notification_1.sendNotificationToAllUsers)({
                io: this.io,
                container: this.container,
                type: "market",
                title: "New Market Item Available",
                message: "Check out the new items in the market!",
                data: marketData,
                socketEvent: "market_notification",
            });
        });
    }
    handleAdminGiftUser(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { item, userId }) {
            try {
                console.log("Hitting handleAdminGiftUser");
                console.log("userId", userId);
                const sockets = yield redis_config_1.default.sMembers(`sockets:${userId}`);
                if (sockets && sockets.length > 0) {
                    for (const socketId of sockets) {
                        this.io.to(socketId).emit("gift_notification", {
                            userId: userId,
                            itemData: item,
                            title: "You've received a gift!",
                            message: "An admin has sent you a special gift. Check it now!",
                            type: "gift",
                            isRead: false
                        });
                    }
                }
                yield this.container.notificationSvc.createNotification(dtos_1.CreateNotificationDto.from({
                    userId: userId,
                    title: "You've received a gift!",
                    itemData: item,
                    message: "An admin has sent you a special gift. Check it now!",
                    type: "gift",
                }));
            }
            catch (err) {
                console.error("Error sending gift notification", err);
            }
        });
    }
}
exports.NotificationHandler = NotificationHandler;
