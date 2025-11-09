import { Request, Response } from "express";
import { IAnalyticsController, IAnalyticsService } from "@modules/analytics";
import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler } from "@utils/application";

export class AnalyticsController implements IAnalyticsController {
  constructor(private readonly _analyticsSvc: IAnalyticsService) {}

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
