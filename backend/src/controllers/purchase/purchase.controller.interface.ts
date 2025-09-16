import { NextFunction, Request, Response } from "express";

export interface IPurchaseController {
  createOrder(req: Request, res: Response,next: NextFunction): Promise<void>;
  createMembershipPurchase(req: Request, res: Response,next: NextFunction): Promise<void>;
  getUserMembershipHistory(req: Request, res: Response,next: NextFunction): Promise<void>;
  getPlanHistoryById(req: Request, res: Response,next: NextFunction): Promise<void>;
  getPlanHistory(req: Request, res: Response,next: NextFunction): Promise<void>;
}
