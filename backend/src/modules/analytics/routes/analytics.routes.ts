import { Router } from "express";
import { authMiddleware } from "@middlewares";
import { ANALYSIS_ROUTES } from "@constants";
import { Container } from "@di";

export const analyticsRoutes = (container: Container) => {
    const router = Router();
    const analyticsController  = container.analyticsCtrl;
    router.get(ANALYSIS_ROUTES.USER, authMiddleware, analyticsController.getUserAnalytics.bind(analyticsController));
    router.get(ANALYSIS_ROUTES.CHALLENGE, authMiddleware, analyticsController.getChallengeStats.bind(analyticsController));
    router.get(ANALYSIS_ROUTES.LEADERBOARD, authMiddleware, analyticsController.getLeaderboardData.bind(analyticsController));
    return router;
}


