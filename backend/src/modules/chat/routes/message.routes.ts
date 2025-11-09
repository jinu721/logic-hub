import express from "express";
import { upload } from "@utils/application";
import { authMiddleware } from "@middlewares";
import { MESSAGE_ROUTES } from "@constants";
import { Container } from "@di";


export const messageRoutes = (container: Container) => {

    const router = express.Router();
    
    const messageController = container.messageCtrl;
    
    router.use(authMiddleware);
    
    router.get(MESSAGE_ROUTES.BASE, messageController.getMessages.bind(messageController));
    router.patch(MESSAGE_ROUTES.EDIT, messageController.editMessage.bind(messageController));
    router.delete(MESSAGE_ROUTES.DELETE, messageController.deleteMessage.bind(messageController));
    router.post(MESSAGE_ROUTES.REACTION.ADD, messageController.addReaction.bind(messageController));
    router.delete(MESSAGE_ROUTES.REACTION.REMOVE, messageController.removeReaction.bind(messageController));
    router.post(MESSAGE_ROUTES.SEEN, messageController.markAsSeen.bind(messageController));
    router.get(MESSAGE_ROUTES.BY_ID, messageController.getMessageById.bind(messageController));
    router.post(MESSAGE_ROUTES.UPLOAD, upload.single("file"), messageController.uploadMessage.bind(messageController));
    
    return router;
}

