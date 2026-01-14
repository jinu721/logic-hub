"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUP_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.GROUP_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_USER: "/:userId",
    UPDATE: "/:groupId",
    DELETE: "/:groupId",
    GET_ALL: commen_routes_1.COMMON_ROUTES.BASE,
    JOIN_REQUEST: "/:groupId/join-request",
    UPLOAD_IMAGE: "/image",
};
