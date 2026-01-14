"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTORY_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.INVENTORY_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_TYPE: "/:type",
    BY_ID: "/:type/:id",
};
