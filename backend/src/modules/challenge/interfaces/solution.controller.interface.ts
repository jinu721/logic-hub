import { NextFunction, Request, Response } from "express";

export interface ISolutionController {
  createSolution(req: Request, res: Response,next: NextFunction): Promise<void>;
  getSolutionsByChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getSolutionsByUser(req: Request, res: Response,next: NextFunction): Promise<void>;
  likeSolution(req: Request, res: Response,next: NextFunction): Promise<void>;
  commentSolution(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteComment(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateSolution(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteSolution(req: Request, res: Response,next: NextFunction): Promise<void>;
}
