import { Request, Response } from "express";

export interface ISolutionController {
  create(req: Request, res: Response): Promise<void>;
  getByChallenge(req: Request, res: Response): Promise<void>;
  getByUser(req: Request, res: Response): Promise<void>;
  like(req: Request, res: Response): Promise<void>;
  comment(req: Request, res: Response): Promise<void>;
  deleteComment(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
}
