import express from "express";
import { upload } from "../utils/application/upload.helper";
import { authMiddleware } from "../middlewares/auth.middleware";
import { GROUP_ROUTES } from "../constants/ROUTES/group.constants";
import { container } from "../di/container";

const router = express.Router();

const groupController = container.groupCtrl;

router.use(authMiddleware);

router.post(
  GROUP_ROUTES.BASE,
  upload.single("groupImage"),
  groupController.createGroup.bind(groupController)
);

router.get(
  GROUP_ROUTES.BY_USER,
  groupController.findByUser.bind(groupController)
);
router.put(
  GROUP_ROUTES.UPDATE,
  groupController.updateGroup.bind(groupController)
);
router.delete(
  GROUP_ROUTES.DELETE,
  groupController.deleteGroup.bind(groupController)
);
router.get(
  GROUP_ROUTES.GET_ALL,
  groupController.getAllGroups.bind(groupController)
);

router.post(
  GROUP_ROUTES.JOIN_REQUEST,
  groupController.sendJoinRequest.bind(groupController)
);

router.post(
  GROUP_ROUTES.UPLOAD_IMAGE,
  upload.single("groupImage"),
  groupController.uploadProfile.bind(groupController)
);
export default router;
