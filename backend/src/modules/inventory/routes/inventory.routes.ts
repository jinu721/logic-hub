import { Router } from "express";
import { upload } from "@utils/application";
import { authMiddleware } from "@shared/middlewares";
import { INVENTORY_ROUTES } from "@constants";
import { Container } from "@di";
import { InventoryController } from "@modules/inventory";

export function inventoryRoutes(container: Container) {
  const router = Router();

  const controllerMap: Record<string, InventoryController> = {
    avatars: container.avatarCtrl,
    banners: container.bannerCtrl,
    badges: container.badgeCtrl,
  };

  const getController = (type: string): InventoryController => {
    const normalizedType = type.endsWith('s') ? type : `${type}s`;
    const controller = controllerMap[normalizedType];
    if (!controller) throw new Error(`Invalid controller type: ${type}`);
    return controller;
  };

  router.use(authMiddleware);

  router.post(
    INVENTORY_ROUTES.BY_TYPE,
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err) return next(err);
        return getController(req.params.type).create(req, res, next);
      });
    }
  );

  router.get(
    INVENTORY_ROUTES.BY_TYPE,
    (req, res, next) =>
      getController(req.params.type).getAll(req, res, next)
  );

  router.get(
    INVENTORY_ROUTES.BY_ID,
    (req, res, next) =>
      getController(req.params.type).getById(req, res, next)
  );

  router.put(
    INVENTORY_ROUTES.BY_ID,
    (req, res, next) =>
      getController(req.params.type).update(req, res, next)
  );

  router.delete(
    INVENTORY_ROUTES.BY_ID,
    (req, res, next) =>
      getController(req.params.type).delete(req, res, next)
  );

  return router;
}
