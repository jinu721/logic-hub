"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelsRoutes = void 0;
const express_1 = require("express");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const levelsRoutes = (container) => {
    const router = (0, express_1.Router)();
    const levelController = container.levelCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.LEVEL_ROUTES.BASE, levelController.createLevel.bind(levelController));
    router.get(_constants_1.LEVEL_ROUTES.BASE, levelController.getAllLevels.bind(levelController));
    router.get(_constants_1.LEVEL_ROUTES.BY_ID, levelController.getLevelById.bind(levelController));
    router.put(_constants_1.LEVEL_ROUTES.UPDATE, levelController.updateLevel.bind(levelController));
    router.delete(_constants_1.LEVEL_ROUTES.DELETE, levelController.deleteLevel.bind(levelController));
    router.put(_constants_1.LEVEL_ROUTES.USER_XP, levelController.updateUserLevel.bind(levelController));
    return router;
};
exports.levelsRoutes = levelsRoutes;
