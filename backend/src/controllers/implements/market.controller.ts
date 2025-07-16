import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import { IMarketController } from "../interfaces/market.controller.interface";
import { IMarketService } from "../../services/interfaces/market.service.interface";

export class MarketController implements IMarketController {

  private marketService:IMarketService

  constructor(marketService:IMarketService) {
    this.marketService = marketService
  }

  async createItem(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body", req.body);
      const result = await this.marketService.createItem(req.body);
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create item" });
    }
  }

  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const filter = {category: req.query.category, searchQuery: req.query.searchQuery, sortOption: req.query.sortOption};
      const page = req.query.page;
      const limit = req.query.limit;
      const result = await this.marketService.getAllItems(filter,Number(page),Number(limit));
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get items" });
    }
  }

  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.marketService.getItemById(req.params.id);
      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Item not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get item" });
    }
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.marketService.updateItem(req.params.id, req.body);
      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Item not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to update item" });
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.marketService.deleteItem(req.params.id);
      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Item not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete item" });
    }
  }
  async purchaseMarketItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const itemId = req.params.id;

      if (!itemId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Item ID is required" });
        return;
      }

      const result = await this.marketService.purchaseMarketItem(itemId, userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to purchase item" });
    }
  }
}
