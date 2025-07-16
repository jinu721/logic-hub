import express from "express";
import { GroupController } from "../controllers/implements/group.controller";
import { GroupService } from "../services/implements/group.service";
import { GroupRepository } from "../repository/implements/group.repository";
import { upload } from "../utils/upload.helper";
import { ConversationRepository } from "../repository/implements/conversation.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const groupController = new GroupController(
  new GroupService(new GroupRepository(), new ConversationRepository())
);

router.use(authMiddleware);

router.post("/", upload.single("groupImage"), groupController.createGroup.bind(groupController));
router.get("/:userId", groupController.findByUser.bind(groupController));
router.put("/:groupId", groupController.updateGroup.bind(groupController));
router.delete("/:groupId", groupController.deleteGroup.bind(groupController));
router.get("/", groupController.getAllGroups.bind(groupController));

router.post("/:groupId/join-request", groupController.sendJoinRequest.bind(groupController));

router.post("/image", upload.single("groupImage"), groupController.uploadProfile.bind(groupController));

export default router;
