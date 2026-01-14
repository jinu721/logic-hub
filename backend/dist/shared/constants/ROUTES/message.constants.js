"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.MESSAGE_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    EDIT: commen_routes_1.COMMON_ROUTES.BASE,
    DELETE: "/:messageId",
    REACTION: {
        ADD: "/reaction",
        REMOVE: "/reaction",
    },
    SEEN: "/seen",
    BY_ID: "/:messageId",
    UPLOAD: "/upload",
};
