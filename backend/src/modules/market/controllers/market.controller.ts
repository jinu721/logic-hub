import { Request, Response } from "express";
import { HttpStatus } from "@constants/http.status";
import { IMarketController, IMarketService } from "@modules/market";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class MarketController implements IMarketController {
  constructor(private readonly _marketSvc: IMarketService) {}

  createItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Item data is required");
    }

    const result = await this._marketSvc.createItem(req.body);
    sendSuccess(res, HttpStatus.CREATED, result, "Item created successfully");
  });

  getAllItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filter = {
      category: req.query.category,
      searchQuery: req.query.searchQuery,
      sortOption: req.query.sortOption,
    };
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await this._marketSvc.getAllItems(filter, page, limit);
    sendSuccess(res, HttpStatus.OK, result, "Items fetched successfully");
  });

  getItemById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Item ID is required");
    }

    const result = await this._marketSvc.getItemById(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Item fetched successfully");
  });

  updateItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || !req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Item ID and data are required");
    }

    const result = await this._marketSvc.updateItem(id, req.body);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Item updated successfully");
  });

  deleteItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Item ID is required");
    }

    const result = await this._marketSvc.deleteItem(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, null, "Item deleted successfully");
  });

  purchaseMarketItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const itemId = req.params.id;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    if (!itemId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Item ID is required");
    }

    const result = await this._marketSvc.purchaseMarketItem(itemId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Item purchased successfully");
  });
}
