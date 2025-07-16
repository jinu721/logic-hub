import { Router } from "express";
import { PurchaseController } from "../controllers/implements/purchase.controller";
import { PurchaseService } from "../services/implements/purchase.service";
import { PurchaseRepository } from "../repository/implements/purchase.repository";
import { MembershipRepository } from "../repository/implements/membership.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const purchaseController = new PurchaseController(
  new PurchaseService(
    new PurchaseRepository(),
    new MembershipRepository(),
    new UserRepository()
  )
);

router.use(authMiddleware);

router.post('/create-order', purchaseController.createOrder.bind(purchaseController));
router.post('/', purchaseController.createMembershipPurchase.bind(purchaseController));
router.get('/history/:id', purchaseController.getPlanHistoryById.bind(purchaseController));
router.get('/history', purchaseController.getPlanHistory.bind(purchaseController));
router.get('/:userId', purchaseController.getUserMembershipHistory.bind(purchaseController));

export default router;
