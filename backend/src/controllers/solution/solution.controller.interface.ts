import { NextFunction, Request, Response } from "express";

export interface ISolutionController {
  create(req: Request, res: Response,next: NextFunction): Promise<void>;
  getByChallenge(req: Request, res: Response,next: NextFunction): Promise<void>;
  getByUser(req: Request, res: Response,next: NextFunction): Promise<void>;
  like(req: Request, res: Response,next: NextFunction): Promise<void>;
  comment(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteComment(req: Request, res: Response,next: NextFunction): Promise<void>;
  update(req: Request, res: Response,next: NextFunction): Promise<void>;
  delete(req: Request, res: Response,next: NextFunction): Promise<void>;
}
