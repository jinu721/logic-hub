import { Router } from "express";
import { authMiddleware } from "../shared/middlewares/auth.middleware";
import { container } from "../di/types";
import { ANALYSIS_ROUTES } from "../shared/constants/ROUTES/analysis.constants";

const router = Router();

const analyticsController  = container.analyticsCtrl;

router.get(ANALYSIS_ROUTES.USER, authMiddleware, analyticsController.getUserAnalytics.bind(analyticsController));
router.get(ANALYSIS_ROUTES.CHALLENGE, authMiddleware, analyticsController.getChallengeStats.bind(analyticsController));
router.get(ANALYSIS_ROUTES.LEADERBOARD, authMiddleware, analyticsController.getLeaderboardData.bind(analyticsController));

export default router;
