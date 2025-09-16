import { NextFunction, Request, Response } from "express";

export interface IGroupController {
  createGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  findByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllGroups(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendJoinRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  uploadProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}
