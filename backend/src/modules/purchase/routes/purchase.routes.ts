import { Router } from "express";
import { authMiddleware } from "@middlewares";
import { PURCHASE_ROUTES } from "@constants";
import { Container } from "@di";



export const purchaseRoutes = (container: Container) => {
    const router = Router();
    
    const purchaseController = container.purchaseCtrl;
    
    router.use(authMiddleware);
    
    router.post(PURCHASE_ROUTES.CREATE_ORDER, purchaseController.createOrder.bind(purchaseController));
    router.post(PURCHASE_ROUTES.CREATE_MEMBERSHIP, purchaseController.createMembershipPurchase.bind(purchaseController));
    router.get(PURCHASE_ROUTES.HISTORY_BY_ID, purchaseController.getPlanHistoryById.bind(purchaseController));
    router.get(PURCHASE_ROUTES.HISTORY, purchaseController.getPlanHistory.bind(purchaseController));
    router.get(PURCHASE_ROUTES.USER_HISTORY, purchaseController.getUserMembershipHistory.bind(purchaseController));
    
    return router;
}

