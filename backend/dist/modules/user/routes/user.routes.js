"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const userRoutes = (container) => {
    const router = express_1.default.Router();
    const userController = container.userCtrl;
    router.post(_constants_1.USER_ROUTES.CHECK_USER, userController.findUser.bind(userController));
    router.post(_constants_1.USER_ROUTES.VERIFY_ADMIN, userController.verifyAdmin.bind(userController));
    router.get(_constants_1.USER_ROUTES.BASE, _middlewares_1.authMiddleware, userController.getUsers.bind(userController));
    router.get(_constants_1.USER_ROUTES.ME, _middlewares_1.authMiddleware, userController.getCurrentUser.bind(userController));
    router.put(_constants_1.USER_ROUTES.UPDATE_ME, _middlewares_1.authMiddleware, userController.updateCurrentUser.bind(userController));
    router.get(_constants_1.USER_ROUTES.BY_USERNAME, _middlewares_1.authMiddleware, userController.getUser.bind(userController));
    router.patch(_constants_1.USER_ROUTES.BAN_USER, _middlewares_1.authMiddleware, userController.toggleBan.bind(userController));
    router.post(_constants_1.USER_ROUTES.GIFT_ITEM, _middlewares_1.authMiddleware, userController.giftItem.bind(userController));
    router.post(_constants_1.USER_ROUTES.CANCEL_MEMBERSHIP, _middlewares_1.authMiddleware, userController.cancelMembership.bind(userController));
    router.post(_constants_1.USER_ROUTES.CLAIM_DAILY_REWARD, _middlewares_1.authMiddleware, userController.claimDailyReward.bind(userController));
    router.post(_constants_1.USER_ROUTES.PURCHASE_MARKET, _middlewares_1.authMiddleware, userController.purchaseMarketItem.bind(userController));
    return router;
};
exports.userRoutes = userRoutes;
