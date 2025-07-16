import { Request, Response } from "express";

export interface IPurchaseController {
  createOrder(req: Request, res: Response): Promise<void>;
  createMembershipPurchase(req: Request, res: Response): Promise<void>;
  getUserMembershipHistory(req: Request, res: Response): Promise<void>;
  getPlanHistoryById(req: Request, res: Response): Promise<void>;
  getPlanHistory(req: Request, res: Response): Promise<void>;
}
