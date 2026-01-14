"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.NOTIFICATION_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
    USER_ME: "/user/me",
    MARK_ALL: "/mark/all",
    DELETE_ALL: "/delete/all/:userId",
    TOGGLE_USER: "/toggle/user",
};
