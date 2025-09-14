import { Request, Response } from "express";
import { IAdminAnalyticsController } from "../interfaces/analytics.controller.interface";
import { IAdminAnalyticsService } from "../../services/interfaces/analytics.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendError, sendSuccess } from "../../utils/application/response.util";
import logger from "../../utils/application/logger";

export class AdminAnalyticsController implements IAdminAnalyticsController {
  constructor(private readonly _analyticsSvc: IAdminAnalyticsService) {}

  async getUserAnalytics(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this._analyticsSvc.fetchUserAnalytics();
      return sendSuccess(res,HttpStatus.OK,{ success: true, data }, "User analytics fetched successfully");
    } catch (error) {
      logger.error(`Failed to fetch user analytics ${req.method} ${req.url}`, {error});
      return sendError(res,HttpStatus.INTERNAL_SERVER_ERROR,{ success: false, message: "Failed to fetch user analytics" });
    }
  }

  async getChallengeStats(req: Request, res: Response): Promise<Response> {
    try {
      const data = await this._analyticsSvc.fetchChallengeStats();
      return sendSuccess(res,HttpStatus.OK,{ success: true, data }, "Challenge stats fetched successfully");
    } catch (error) {
      logger.error(`Failed to fetch challenge stats ${req.method} ${req.url}`, {error});
      return sendError(res,HttpStatus.INTERNAL_SERVER_ERROR,{ success: false, message: "Failed to fetch challenge stats" });
    }
  }

  async getLeaderboardData(req: Request, res: Response): Promise<Response> {
    try {
      const based = req.query.based?.toString() || "txp" 
      const category = req.query.category?.toString() || "";
      const period = req.query.period?.toString() || "week" 
      const order = req.query.order?.toString() || "desc"
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await this._analyticsSvc.getLeaderboardData(based,category,period,order,page,limit);
      return sendSuccess(res,HttpStatus.OK,{ success: true, data }, "Leaderboard trends fetched successfully");
    } catch (error) {
      logger.error(`Failed to fetch leaderboard trends ${req.method} ${req.url}`, {error});
      return sendError(res,HttpStatus.INTERNAL_SERVER_ERROR,{ success: false, message: "Failed to fetch leaderboard trends" });
    }
  }
}
