import { Request, Response } from "express";

export interface IAdminAnalyticsController {
  getUserAnalytics(req: Request, res: Response): Promise<void>;
  getChallengeStats(req: Request, res: Response): Promise<void>;
  getLeaderboardData(req: Request, res: Response): Promise<void>;
}
