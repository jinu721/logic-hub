"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const message_handler_1 = require("./socketHandlers/message.handler");
const group_handler_1 = require("./socketHandlers/group.handler");
const notification_handler_1 = require("./socketHandlers/notification.handler");
const user_handler_1 = require("./socketHandlers/user.handler");
const setupSocket = (io, container) => {
    const messageHandler = new message_handler_1.MessageHandler(io, container);
    const groupHandler = new group_handler_1.GroupHandler(io, container);
    const notificationHandler = new notification_handler_1.NotificationHandler(io, container);
    const userHandler = new user_handler_1.UserHandler(io, container);
    io.on("connection", (socket) => {
        messageHandler.setupMessageHandlers(socket);
        groupHandler.setupGroupHandlers(socket);
        notificationHandler.setupNotificationHandlers(socket);
        userHandler.setupUserHandlers(socket);
    });
};
exports.setupSocket = setupSocket;
