import { Request, Response } from "express";

export interface IAdminAnalyticsController {
  getUserAnalytics(req: Request, res: Response): Promise<Response>;
  getChallengeStats(req: Request, res: Response): Promise<Response>;
  getLeaderboardData(req: Request, res: Response): Promise<Response>;
}
