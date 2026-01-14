"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const application_1 = require("../../../shared/utils/application");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const messageRoutes = (container) => {
    const router = express_1.default.Router();
    const messageController = container.messageCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.get(_constants_1.MESSAGE_ROUTES.BASE, messageController.getMessages.bind(messageController));
    router.patch(_constants_1.MESSAGE_ROUTES.EDIT, messageController.editMessage.bind(messageController));
    router.delete(_constants_1.MESSAGE_ROUTES.DELETE, messageController.deleteMessage.bind(messageController));
    router.post(_constants_1.MESSAGE_ROUTES.REACTION.ADD, messageController.addReaction.bind(messageController));
    router.delete(_constants_1.MESSAGE_ROUTES.REACTION.REMOVE, messageController.removeReaction.bind(messageController));
    router.post(_constants_1.MESSAGE_ROUTES.SEEN, messageController.markAsSeen.bind(messageController));
    router.get(_constants_1.MESSAGE_ROUTES.BY_ID, messageController.getMessageById.bind(messageController));
    router.post(_constants_1.MESSAGE_ROUTES.UPLOAD, application_1.upload.single("file"), messageController.uploadMessage.bind(messageController));
    return router;
};
exports.messageRoutes = messageRoutes;
