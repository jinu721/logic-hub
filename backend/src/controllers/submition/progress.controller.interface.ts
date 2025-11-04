import { NextFunction, Request, Response } from "express";

export interface IChallengeProgressController {
  createProgress(req: Request, res: Response,next: NextFunction): Promise<void>;
  getProgressByUserAndChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getProgressById(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateProgress(req: Request, res: Response,next: NextFunction): Promise<void>;
  getRecentProgress(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteProgress(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllProgressByUser(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllProgressByChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllProgress(req: Request, res: Response,next: NextFunction): Promise<void>;
  getHeatmap(req:Request,res:Response,next: NextFunction):Promise<void>;
}
