import express from "express";
import { MessageController } from "../controllers/implements/message.controller";
import { MessageService } from "../services/implements/message.service";
import { MessageRepository } from "../repository/implements/message.repository";
import { upload } from "../utils/upload.helper";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const messageController = new MessageController(
  new MessageService(new MessageRepository())
);

router.use(authMiddleware);

// router.post("/", messageController.createMessage.bind(messageController)); // Uncomment if needed
router.get("/", messageController.getMessages.bind(messageController));
router.patch("/", messageController.editMessage.bind(messageController));
router.delete("/:messageId", messageController.deleteMessage.bind(messageController));
router.post("/reaction", messageController.addReaction.bind(messageController));
router.delete("/reaction", messageController.removeReaction.bind(messageController));
router.post("/seen", messageController.markAsSeen.bind(messageController));
router.get("/:messageId", messageController.getMessageById.bind(messageController));
router.post("/upload", upload.single("file"), messageController.uploadMessage.bind(messageController));

export default router;
