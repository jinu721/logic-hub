"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBMISSION_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.SUBMISSION_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
    BY_USER: "/user/:username",
    RECENT_BY_USER: "/recent/user/:input",
    BY_CHALLENGE: "/challenge/:challengeId",
    HEATMAP: "/user/heatmap/:userId",
    BY_USER_AND_CHALLENGE: "/user/:userId/challenge/:challengeId",
};
