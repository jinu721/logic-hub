"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseRoutes = void 0;
const express_1 = require("express");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const purchaseRoutes = (container) => {
    const router = (0, express_1.Router)();
    const purchaseController = container.purchaseCtrl;
    router.use(_middlewares_1.authMiddleware);
    router.post(_constants_1.PURCHASE_ROUTES.CREATE_ORDER, purchaseController.createOrder.bind(purchaseController));
    router.post(_constants_1.PURCHASE_ROUTES.CREATE_MEMBERSHIP, purchaseController.createMembershipPurchase.bind(purchaseController));
    router.get(_constants_1.PURCHASE_ROUTES.HISTORY_BY_ID, purchaseController.getPlanHistoryById.bind(purchaseController));
    router.get(_constants_1.PURCHASE_ROUTES.HISTORY, purchaseController.getPlanHistory.bind(purchaseController));
    router.get(_constants_1.PURCHASE_ROUTES.USER_HISTORY, purchaseController.getUserMembershipHistory.bind(purchaseController));
    return router;
};
exports.purchaseRoutes = purchaseRoutes;
