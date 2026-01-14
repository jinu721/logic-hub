"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMBERSHIP_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.MEMBERSHIP_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    GET_ALL: commen_routes_1.COMMON_ROUTES.BASE,
    ACTIVE: "/active",
    BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
};
