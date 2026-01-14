"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRoutes = inventoryRoutes;
const express_1 = require("express");
const application_1 = require("../../../shared/utils/application");
const middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
function inventoryRoutes(container) {
    const router = (0, express_1.Router)();
    const controllerMap = {
        avatars: container.avatarCtrl,
        banners: container.bannerCtrl,
        badges: container.badgeCtrl,
    };
    const getController = (type) => {
        const normalizedType = type.endsWith('s') ? type : `${type}s`;
        const controller = controllerMap[normalizedType];
        if (!controller)
            throw new Error(`Invalid controller type: ${type}`);
        return controller;
    };
    router.use(middlewares_1.authMiddleware);
    router.post(_constants_1.INVENTORY_ROUTES.BY_TYPE, (req, res, next) => {
        application_1.upload.single("image")(req, res, (err) => {
            if (err)
                return next(err);
            return getController(req.params.type).create(req, res, next);
        });
    });
    router.get(_constants_1.INVENTORY_ROUTES.BY_TYPE, (req, res, next) => getController(req.params.type).getAll(req, res, next));
    router.get(_constants_1.INVENTORY_ROUTES.BY_ID, (req, res, next) => getController(req.params.type).getById(req, res, next));
    router.put(_constants_1.INVENTORY_ROUTES.BY_ID, (req, res, next) => getController(req.params.type).update(req, res, next));
    router.delete(_constants_1.INVENTORY_ROUTES.BY_ID, (req, res, next) => getController(req.params.type).delete(req, res, next));
    return router;
}
