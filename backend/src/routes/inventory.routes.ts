import { Router } from "express";
import { AvatarController } from "../controllers/implements/avatar.controller";
import { AvatarService } from "../services/implements/avatar.service";
import { AvatarRepository } from "../repository/implements/avatar.repository";
import { upload } from "../utils/upload.helper";
import { BannerController } from "../controllers/implements/banner.controller";
import { BannerService } from "../services/implements/banner.service";
import { BannerRepository } from "../repository/implements/banner.repository";
import { BadgeController } from "../controllers/implements/badge.controller";
import { BadgeService } from "../services/implements/badge.service";
import { BadgeRepository } from "../repository/implements/badge.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const controllerMap: Record<string, any> = {
  avatars: new AvatarController(new AvatarService(new AvatarRepository())),
  banners: new BannerController(new BannerService(new BannerRepository())),
  badges: new BadgeController(new BadgeService(new BadgeRepository()))
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
