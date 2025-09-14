import { Request, Response } from "express";

export interface IChallengeProgressController {
  createProgress(req: Request, res: Response): Promise<void>;
  getProgressByUserAndChallenge(req: Request, res: Response): Promise<void>;
  getProgressById(req: Request, res: Response): Promise<void>;
  updateProgress(req: Request, res: Response): Promise<void>;
  deleteProgress(req: Request, res: Response): Promise<void>;
  getRecentProgress(req: Request, res: Response): Promise<void>;
  getAllProgressByUser(req: Request, res: Response): Promise<void>;
  getAllProgressByChallenge(req: Request, res: Response): Promise<void>;
  getAllProgress(req: Request, res: Response): Promise<void>;
  getHeatmap(req:Request,res:Response):Promise<void>;
}
