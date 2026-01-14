"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVEL_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.LEVEL_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
    USER_XP: "/user/:userId/xp",
};
