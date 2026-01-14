"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOLUTION_ROUTES = void 0;
const commen_routes_1 = require("./commen.routes");
exports.SOLUTION_ROUTES = {
    BASE: commen_routes_1.COMMON_ROUTES.BASE,
    BY_CHALLENGE: "/challenge/:challengeId",
    BY_USER: "/user/:userId",
    LIKE: "/:solutionId/like",
    COMMENT: "/:solutionId/comment",
    DELETE_COMMENT: "/:solutionId/comment/:commentId",
    UPDATE: "/:solutionId",
    DELETE: "/:solutionId",
};
