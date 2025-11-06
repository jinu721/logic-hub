import { Router } from "express"
import { upload } from "@utils/application"
import { authMiddleware } from "@shared/middlewares"
import { Container } from "@di";

export function inventoryRoutes(container: Container) {
  const router = Router();

  function getController(type: string) {
    return {
      avatars: container.avatarCtrl,
      banners: container.bannerCtrl,
      badges: container.badgeCtrl
    }[type];
  }

  router.use(authMiddleware);

  router.post("/:type", (req, res, next) => {
    upload.single("image")(req, res, () => {
      getController(req.params.type).create(req, res);
    });
  });

  router.get("/:type", (req, res) => getController(req.params.type).getAll(req, res));
  router.get("/:type/:id", (req, res) => getController(req.params.type).getById(req, res));
  router.put("/:type/:id", (req, res) => getController(req.params.type).update(req, res));
  router.delete("/:type/:id", (req, res) => getController(req.params.type).delete(req, res));

  return router;
}
