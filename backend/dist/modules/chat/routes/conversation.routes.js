"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const conversationRoutes = (container) => {
    const router = express_1.default.Router();
    const conversationController = container.conversationCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.get(_constants_1.CONVERSATION_ROUTES.BY_GROUP, conversationController.findConversationByGroup.bind(conversationController));
    router.get(_constants_1.CONVERSATION_ROUTES.USER_DATA, conversationController.findConversationByUser.bind(conversationController));
    router.get(_constants_1.CONVERSATION_ROUTES.ONE_TO_ONE, conversationController.findOneToOne.bind(conversationController));
    router.post(_constants_1.CONVERSATION_ROUTES.CREATE_ONE_TO_ONE, conversationController.createOneToOne.bind(conversationController));
    router.get(_constants_1.CONVERSATION_ROUTES.FIND_CONVERSATION, conversationController.findConversation.bind(conversationController));
    router.post(_constants_1.CONVERSATION_ROUTES.TYPING.SET, conversationController.setTypingUser.bind(conversationController));
    router.delete(_constants_1.CONVERSATION_ROUTES.TYPING.REMOVE, conversationController.removeTypingUser.bind(conversationController));
    router.get(_constants_1.CONVERSATION_ROUTES.TYPING.GET_USERS, conversationController.getTypingUsers.bind(conversationController));
    return router;
};
exports.conversationRoutes = conversationRoutes;
