import express from "express";
import { upload } from "../shared/utils/application/upload.helper";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { MESSAGE_ROUTES } from "../shared/constants/ROUTES/message.constants";
import { container } from "../di/types";

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

export default router;
