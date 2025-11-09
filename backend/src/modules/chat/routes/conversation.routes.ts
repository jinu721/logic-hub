import express from "express";
import { authMiddleware } from "@middlewares";
import { CONVERSATION_ROUTES } from "@constants";
import { Container } from "@di";


export const conversationRoutes = (container: Container) => {

    const router = express.Router();
    
    const conversationController = container.conversationCtrl;
    
    router.use(authMiddleware);
    
    router.get(CONVERSATION_ROUTES.BY_GROUP, conversationController.findConversationByGroup.bind(conversationController));
    router.get(CONVERSATION_ROUTES.USER_DATA, conversationController.findConversationByUser.bind(conversationController));
    router.get(CONVERSATION_ROUTES.ONE_TO_ONE, conversationController.findOneToOne.bind(conversationController));
    router.post(CONVERSATION_ROUTES.CREATE_ONE_TO_ONE, conversationController.createOneToOne.bind(conversationController));
    router.get(CONVERSATION_ROUTES.FIND_CONVERSATION, conversationController.findConversation.bind(conversationController));
    
    router.post(CONVERSATION_ROUTES.TYPING.SET, conversationController.setTypingUser.bind(conversationController));
    router.delete(CONVERSATION_ROUTES.TYPING.REMOVE, conversationController.removeTypingUser.bind(conversationController));
    router.get(CONVERSATION_ROUTES.TYPING.GET_USERS, conversationController.getTypingUsers.bind(conversationController));
    
    return router;
}
