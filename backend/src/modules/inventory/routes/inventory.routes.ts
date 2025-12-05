import { Router } from "express";
import { upload } from "@utils/application";
import { authMiddleware } from "@shared/middlewares";
import { Container } from "@di";

export function inventoryRoutes(container: Container) {
  const router = Router();

  function getController(type: string) {
    const controller = {
      avatars: container.avatarCtrl,
      banners: container.bannerCtrl,
      badges: container.badgeCtrl,
    }[type];

    if (!controller) {
      throw new Error(`Invalid controller type: ${type}`);
    }

    return controller;
  }

  router.use(authMiddleware);

  router.post("/:type", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return next(err);
      return getController(req.params.type).create(req, res, next);
    });
  });

  router.get("/:type", (req, res, next) =>
    getController(req.params.type).getAll(req, res, next)
  );

  router.get("/:type/:id", (req, res, next) =>
    getController(req.params.type).getById(req, res, next)
  );

  router.put("/:type/:id", (req, res, next) =>
    getController(req.params.type).update(req, res, next)
  );

  router.delete("/:type/:id", (req, res, next) =>
    getController(req.params.type).delete(req, res, next)
  );

  return router;
}
