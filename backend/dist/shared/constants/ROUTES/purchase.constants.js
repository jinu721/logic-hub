"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PURCHASE_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.PURCHASE_ROUTES = {
    CREATE_ORDER: "/create-order",
    CREATE_MEMBERSHIP: commen_routes_1.COMMON_ROUTES.BASE,
    HISTORY_BY_ID: "/history/:id",
    HISTORY: "/history",
    USER_HISTORY: "/:userId",
};
