import { Request, Response } from "express";
import { IAdminAnalyticsController } from "../analysis/analytics.controller.interface";
import { IAdminAnalyticsService } from "../../services/interfaces/analytics.service.interface";
import { HttpStatus } from "../../shared/constants/http.status";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";

export class AdminAnalyticsController implements IAdminAnalyticsController {
  constructor(private readonly _analyticsSvc: IAdminAnalyticsService) {}

  getUserAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await this._analyticsSvc.fetchUserAnalytics();
    sendSuccess(res, HttpStatus.OK, { success: true, data }, "User analytics fetched successfully");
  });

  getChallengeStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await this._analyticsSvc.fetchChallengeStats();
    sendSuccess(res, HttpStatus.OK, { success: true, data }, "Challenge stats fetched successfully");
  });

  getLeaderboardData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const based = req.query.based?.toString() || "txp";
    const category = req.query.category?.toString() || "";
    const period = req.query.period?.toString() || "week";
    const order = req.query.order?.toString() || "desc";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await this._analyticsSvc.getLeaderboardData(based, category, period, order, page, limit);
    sendSuccess(res, HttpStatus.OK, { success: true, data }, "Leaderboard trends fetched successfully");
  });
}
