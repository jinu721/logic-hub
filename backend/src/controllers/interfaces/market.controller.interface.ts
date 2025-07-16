import { Request, Response } from "express";

export interface IMarketController {
  createItem(req: Request, res: Response): Promise<void>;
  getAllItems(req: Request, res: Response): Promise<void>;
  getItemById(req: Request, res: Response): Promise<void>;
  updateItem(req: Request, res: Response): Promise<void>;
  deleteItem(req: Request, res: Response): Promise<void>;
  purchaseMarketItem(req: Request, res: Response): Promise<void>;
}
