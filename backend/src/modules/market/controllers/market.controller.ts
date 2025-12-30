import { Request, Response } from "express";
import { HttpStatus } from "@constants/http.status";
import { IMarketController, IMarketService } from "@modules/market";
import { CreateMarketItemDto, DeleteMarketItemDto, GetAllMarketItemsDto, GetMarketItemDto, UpdateMarketItemDto } from "@modules/market/dtos";
import { sendSuccess, asyncHandler, AppError, toObjectId } from "@utils/application";
import { MarketItemDocument } from "@shared/types";


export class MarketController implements IMarketController {
  constructor(private readonly _marketSvc: IMarketService) { }

  createItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = CreateMarketItemDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._marketSvc.createItem({
      ...dto,
      itemId: toObjectId(dto.itemId),
      category: dto.category as 'avatar' | 'banner' | 'badge'
    });
    sendSuccess(res, HttpStatus.CREATED, result, "Item created successfully");
  });

  getAllItems = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetAllMarketItemsDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const filter = {
      category: dto.category as 'avatar' | 'banner' | 'badge' | undefined,
      searchQuery: dto.searchQuery,
      sortOption: dto.sortOption,
    };
    const page = dto.page ? Number(dto.page) : 1;
    const limit = dto.limit ? Number(dto.limit) : 10;

    const result = await this._marketSvc.getAllItems(filter, page, limit);
    sendSuccess(res, HttpStatus.OK, result, "Items fetched successfully");
  });

  getItemById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetMarketItemDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._marketSvc.getItemById(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Item fetched successfully");
  });

  updateItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateMarketItemDto.from({ id: req.params.id, ...req.body });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const updateData: Partial<MarketItemDocument> = {};
    Object.keys(dto).forEach(key => {
      if (key !== 'itemId') {
        (updateData as unknown as Record<string, unknown>)[key] = (dto as unknown as Record<string, unknown>)[key];
      }
    });
    if (dto.itemId) {
      updateData.itemId = toObjectId(dto.itemId);
    }
    if (dto.category) {
      updateData.category = dto.category as 'avatar' | 'banner' | 'badge';
    }
    const result = await this._marketSvc.updateItem(dto.id, updateData);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Item updated successfully");
  });

  deleteItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = DeleteMarketItemDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const result = await this._marketSvc.deleteItem(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    }

    sendSuccess(res, HttpStatus.OK, null, "Item deleted successfully");
  });
}
