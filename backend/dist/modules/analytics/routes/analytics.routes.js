"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = require("express");
const _middlewares_1 = require("../../../shared/middlewares");
const _constants_1 = require("../../../shared/constants");
const analyticsRoutes = (container) => {
    const router = (0, express_1.Router)();
    const analyticsController = container.analyticsCtrl;
    router.get(_constants_1.ANALYSIS_ROUTES.USER, _middlewares_1.authMiddleware, analyticsController.getUserAnalytics.bind(analyticsController));
    router.get(_constants_1.ANALYSIS_ROUTES.CHALLENGE, _middlewares_1.authMiddleware, analyticsController.getChallengeStats.bind(analyticsController));
    router.get(_constants_1.ANALYSIS_ROUTES.LEADERBOARD, _middlewares_1.authMiddleware, analyticsController.getLeaderboardData.bind(analyticsController));
    return router;
};
exports.analyticsRoutes = analyticsRoutes;
