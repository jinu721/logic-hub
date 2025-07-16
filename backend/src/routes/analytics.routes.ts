import { Router } from "express";
import { AdminAnalyticsController } from "../controllers/implements/analytics.controller";
import { AdminAnalyticsRepository } from "../repository/implements/analytics.repository";
import { AdminAnalyticsService } from "../services/implements/analytics.service";
import { LeaderboardRepository } from "../repository/implements/leaderboard.repostory";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const analyticsController = new AdminAnalyticsController(
  new AdminAnalyticsService(
    new AdminAnalyticsRepository(),
    new LeaderboardRepository()
  )
);

router.get("/users", authMiddleware, analyticsController.getUserAnalytics.bind(analyticsController));
router.get("/challenges", authMiddleware, analyticsController.getChallengeStats.bind(analyticsController));
router.get("/leaderboard", authMiddleware, analyticsController.getLeaderboardData.bind(analyticsController));

export default router;
