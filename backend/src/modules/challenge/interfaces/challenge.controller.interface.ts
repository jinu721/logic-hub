import { NextFunction, Request, Response } from "express";

export interface IChallengeController {
  createChallenge(req: Request, res: Response, next: NextFunction): Promise<void>;
  getChallengeById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserHomeChallenges(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllChallenges(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateChallenge(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteChallenge(req: Request, res: Response, next: NextFunction): Promise<void>;
  runChallengeCode(req: Request, res: Response, next: NextFunction): Promise<void>;
  submitChallenge(req: Request, res: Response, next: NextFunction): Promise<void>;
}
