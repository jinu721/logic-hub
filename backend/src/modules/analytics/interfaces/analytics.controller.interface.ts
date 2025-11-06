import { NextFunction, Request, Response } from "express";

export interface IAnalyticsController {
  getUserAnalytics(req: Request, res: Response, next:NextFunction): Promise<void>;
  getChallengeStats(req: Request, res: Response, next:NextFunction): Promise<void>;
  getLeaderboardData(req: Request, res: Response, next:NextFunction): Promise<void>;
}
