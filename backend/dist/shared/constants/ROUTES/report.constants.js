"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.REPORT_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_ID: "/:id",
    STATUS: "/:id/status",
};
