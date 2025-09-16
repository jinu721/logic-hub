import { Router } from "express";
import { upload } from "../utils/application/upload.helper";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "../di/container";

const router = Router();

const controllerMap: Record<string, any> = {
  avatars: container.avatarCtrl,
  banners: container.bannerCtrl,
  badges: container.badgeCtrl
};

function getController(type: string) {
  const controller = controllerMap[type];
  if (!controller) throw new Error("Invalid inventory type");
  return controller;
}

router.use(authMiddleware);

router.post("/:type", upload.single("image"), (req, res) => getController(req.params.type).create(req, res));
router.get("/:type", (req, res) => getController(req.params.type).getAll(req, res));
router.get("/:type/:id", (req, res) => getController(req.params.type).getById(req, res));
router.put("/:type/:id", (req, res) => getController(req.params.type).update(req, res));
router.delete("/:type/:id", (req, res) => getController(req.params.type).delete(req, res));

export default router;
