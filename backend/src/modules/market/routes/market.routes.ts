import express from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { MARKET_ROUTES } from "@constants/ROUTES/market.constants";
import { Container } from "@di/types";


export const marketRoutes = (container: Container) => {
    const router = express.Router();
    
    const marketController = container.marketCtrl;
    
    router.use(authMiddleware);
    
    router.post(MARKET_ROUTES.CREATE, marketController.createItem.bind(marketController));
    router.put(MARKET_ROUTES.UPDATE, marketController.updateItem.bind(marketController));
    router.delete(MARKET_ROUTES.DELETE, marketController.deleteItem.bind(marketController));
    router.get(MARKET_ROUTES.GET_ALL, marketController.getAllItems.bind(marketController));
    router.get(MARKET_ROUTES.GET_BY_ID, marketController.getItemById.bind(marketController));
    
    return router;
}

