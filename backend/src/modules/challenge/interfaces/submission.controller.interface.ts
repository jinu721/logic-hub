import { NextFunction, Request, Response } from "express";

export interface ISubmissionController {
  createSubmission(req: Request, res: Response,next: NextFunction): Promise<void>;
  getSubmissionsByUserAndChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getSubmissionById(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateSubmission(req: Request, res: Response,next: NextFunction): Promise<void>;
  getRecentSubmissions(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteSubmission(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllSubmissionsByUser(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllSubmissionsByChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllSubmissions(req: Request, res: Response,next: NextFunction): Promise<void>;
  getHeatmap(req:Request,res:Response,next: NextFunction):Promise<void>;
}
