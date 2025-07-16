import express from "express";
import { ConversationController } from "../controllers/implements/conversation.controller";
import { ConversationService } from "../services/implements/conversation.service";
import { ConversationRepository } from "../repository/implements/conversation.repository";
import { GroupRepository } from "../repository/implements/group.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const conversationController = new ConversationController(
  new ConversationService(
    new ConversationRepository(),
    new GroupRepository(),
    new UserRepository()
  )
);

router.use(authMiddleware);

router.get("/by-group/:groupId", conversationController.findConversationByGroup.bind(conversationController));
router.get("/user/:id/data", conversationController.findConversationByUser.bind(conversationController));
router.get("/:userA/:userB", conversationController.findOneToOne.bind(conversationController));
router.post("/", conversationController.createOneToOne.bind(conversationController));
router.get("/:conversationId", conversationController.findConversation.bind(conversationController));

router.post("/typing", conversationController.setTypingUser.bind(conversationController));
router.delete("/typing", conversationController.removeTypingUser.bind(conversationController));
router.get("/typing/:conversationId", conversationController.getTypingUsers.bind(conversationController));

export default router;
