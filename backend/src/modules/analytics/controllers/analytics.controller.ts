import { Request, Response } from "express";
import { IAnalyticsController, IAnalyticsService } from "@modules/analytics";
import { HttpStatus } from "@constants";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";
import { LeaderboardQueryDto } from "@modules/analytics/dtos"

export class AnalyticsController implements IAnalyticsController {
  constructor(private readonly _analyticsSvc: IAnalyticsService) { }

  getUserAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await this._analyticsSvc.fetchUserAnalytics();
    sendSuccess(res, HttpStatus.OK, { success: true, data }, "User analytics fetched successfully");
  });

  getChallengeStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = await this._analyticsSvc.fetchChallengeStats();
    sendSuccess(res, HttpStatus.OK, { success: true, data }, "Challenge stats fetched successfully");
  });

  getLeaderboardData = asyncHandler(async (req, res) => {
    const dto = LeaderboardQueryDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const data = await this._analyticsSvc.getLeaderboardData(
      dto.based,
      dto.category,
      dto.period,
      dto.order,
      dto.page,
      dto.limit
    );

    sendSuccess(res, HttpStatus.OK, { success: true, data }, "Leaderboard trends fetched successfully");
  });
}
