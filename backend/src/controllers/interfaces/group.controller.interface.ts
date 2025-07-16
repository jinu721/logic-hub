import { Request, Response } from "express";

export interface IGroupController {
  createGroup(req: Request, res: Response): Promise<void>;
  findByUser(req: Request, res: Response): Promise<void>;
  getAllGroups(req: Request, res: Response): Promise<void>;
  updateGroup(req: Request, res: Response): Promise<void>;
  deleteGroup(req: Request, res: Response): Promise<void>;
  sendJoinRequest(req: Request, res: Response): Promise<void>;
  uploadProfile(req: Request, res: Response): Promise<void>;
}
