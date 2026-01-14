"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARKET_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.MARKET_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    CREATE: commen_routes_1.COMMON_ROUTES.BASE,
    UPDATE: "/:id",
    DELETE: "/:id",
    GET_ALL: commen_routes_1.COMMON_ROUTES.BASE,
    GET_BY_ID: "/:id",
};
