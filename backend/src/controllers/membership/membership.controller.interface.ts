import { NextFunction, Request, Response } from "express";

export interface IMembershipController {
  createMembership(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllMemberships(req: Request, res: Response,next: NextFunction): Promise<void>;
  getTwoActiveMemberships(req: Request, res: Response,next: NextFunction): Promise<void>;
  getMembershipById(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateMembership(req: Request, res: Response,next: NextFunction): Promise<void>;
  deleteMembership(req: Request, res: Response,next: NextFunction): Promise<void>;
}
