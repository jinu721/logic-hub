import express from "express";
import { MarketController } from "../controllers/implements/market.controller";
import { MarketService } from "../services/implements/market.service";
import { MarketRepository } from "../repository/implements/market.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const marketController = new MarketController(
  new MarketService(new MarketRepository(), new UserRepository())
);

router.use(authMiddleware);

router.post("/", marketController.createItem.bind(marketController));
router.put("/:id", marketController.updateItem.bind(marketController));
router.delete("/:id", marketController.deleteItem.bind(marketController));
router.post("/:id/purchase", marketController.purchaseMarketItem.bind(marketController));
router.get("/", marketController.getAllItems.bind(marketController));
router.get("/:id", marketController.getItemById.bind(marketController));

export default router;
