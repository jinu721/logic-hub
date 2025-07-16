import { Request, Response } from "express";
import { IAdminAnalyticsController } from "../interfaces/analytics.controller.interface";
import { IAdminAnalyticsService } from "../../services/interfaces/analytics.service.interface";
import { HttpStatus } from "../../constants/http.status";

export class AdminAnalyticsController implements IAdminAnalyticsController {
  constructor(private analyticsService: IAdminAnalyticsService) {}

  async getUserAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.analyticsService.fetchUserAnalytics();
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch user analytics" });
    }
  }

  async getChallengeStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.analyticsService.fetchChallengeStats();
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch challenge stats" });
    }
  }

  async getLeaderboardData(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.query", req.query);
      const based = req.query.based?.toString() || "txp" // "txp" | "fastest" | "streak" | "level" | "rank" | "domain" | "category" ;
      const category = req.query.category?.toString() || "" // "novice" | "adept" |"master" | "";
      const period = req.query.period?.toString() || "week"  // "week" | "month" | "year";
      const order = req.query.order?.toString() || "desc"// "asc" | "desc";
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await this.analyticsService.getLeaderboardData(based,category,period,order,page,limit);
      res.status(HttpStatus.OK).json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch leaderboard trends" });
    }
  }
}
