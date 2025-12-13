import express from "express";
import { authMiddleware } from "@middlewares";
import { USER_ROUTES } from "@constants";
import { Container } from "@di/types";

export const userRoutes = (container: Container) => {
  const router = express.Router();
  const userController = container.userCtrl;

  router.post(USER_ROUTES.CHECK_USER, userController.findUser.bind(userController));
  router.post(USER_ROUTES.VERIFY_ADMIN, userController.verifyAdmin.bind(userController));

  router.get(USER_ROUTES.BASE, authMiddleware, userController.getUsers.bind(userController));
  router.get(USER_ROUTES.ME, authMiddleware, userController.getCurrentUser.bind(userController));
  router.put(USER_ROUTES.UPDATE_ME, authMiddleware, userController.updateCurrentUser.bind(userController));
  router.get(USER_ROUTES.BY_USERNAME, authMiddleware, userController.getUser.bind(userController));
  router.patch(USER_ROUTES.BAN_USER, authMiddleware, userController.toggleBan.bind(userController));
  router.post(USER_ROUTES.GIFT_ITEM, authMiddleware, userController.giftItem.bind(userController));
  router.post(USER_ROUTES.CANCEL_MEMBERSHIP, authMiddleware, userController.cancelMembership.bind(userController));
  router.post(USER_ROUTES.CLAIM_DAILY_REWARD, authMiddleware, userController.claimDailyReward.bind(userController));
  router.post(USER_ROUTES.PURCHASE_MARKET, authMiddleware, userController.purchaseMarketItem.bind(userController));

  return router;
}
