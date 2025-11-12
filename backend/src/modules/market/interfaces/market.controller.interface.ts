import { NextFunction, Request, Response } from "express";

export interface IMarketController {
  createItem(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  getItemById(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteItem(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateItem(req: Request, res: Response, next: NextFunction): Promise<void>;
}
