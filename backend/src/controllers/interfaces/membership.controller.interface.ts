import { Request, Response } from "express";

export interface IMembershipController {
  createMembership(req: Request, res: Response): Promise<void>;
  getAllMemberships(req: Request, res: Response): Promise<void>;
  getTwoActiveMemberships(req: Request, res: Response): Promise<void>;
  getMembershipById(req: Request, res: Response): Promise<void>;
  updateMembership(req: Request, res: Response): Promise<void>;
  deleteMembership(req: Request, res: Response): Promise<void>;
}
