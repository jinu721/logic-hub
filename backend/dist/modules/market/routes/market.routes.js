"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/middlewares/auth.middleware");
const market_constants_1 = require("../../../shared/constants/ROUTES/market.constants");
const marketRoutes = (container) => {
    const router = express_1.default.Router();
    const marketController = container.marketCtrl;
    router.use(auth_middleware_1.authMiddleware);
    router.post(market_constants_1.MARKET_ROUTES.CREATE, marketController.createItem.bind(marketController));
    router.put(market_constants_1.MARKET_ROUTES.UPDATE, marketController.updateItem.bind(marketController));
    router.delete(market_constants_1.MARKET_ROUTES.DELETE, marketController.deleteItem.bind(marketController));
    router.get(market_constants_1.MARKET_ROUTES.GET_ALL, marketController.getAllItems.bind(marketController));
    router.get(market_constants_1.MARKET_ROUTES.GET_BY_ID, marketController.getItemById.bind(marketController));
    return router;
};
exports.marketRoutes = marketRoutes;
