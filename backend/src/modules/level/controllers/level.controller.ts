import { Request, Response } from "express";
import { ILevelService, ILevelController } from "@modules/level";
import { CreateLevelDto, DeleteLevelDto, GetAllLevelsDto, GetLevelDto, UpdateLevelDto, UpdateUserLevelDto } from "@modules/level/dtos";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class LevelController implements ILevelController {
  constructor(private readonly _levelSvc: ILevelService) { }

  updateUserLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateUserLevelDto.from({ userId: req.params.userId, xpPoints: req.body.xpPoints });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const userLevel = await this._levelSvc.updateUserLevel(dto.userId, dto.xpPoints);
    if (!userLevel) {
      throw new AppError(HttpStatus.NOT_FOUND, "User level could not be updated");
    }

    sendSuccess(res, HttpStatus.OK, userLevel, "User level updated successfully");
  });

  createLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = CreateLevelDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const level = await this._levelSvc.createLevel(dto as any);
    sendSuccess(res, HttpStatus.CREATED, level, "Level created successfully");
  });

  getAllLevels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetAllLevelsDto.from(req.query);
    const validation = dto.validate(); 
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const page = dto.page ? Number(dto.page) : 1;
    const limit = dto.limit ? Number(dto.limit) : 10;

    const levels = await this._levelSvc.getAllLevels(page, limit);
    sendSuccess(res, HttpStatus.OK, levels, "Levels fetched successfully");
  });

  getLevelById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetLevelDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const level = await this._levelSvc.getLevelById(dto.id);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level fetched successfully");
  });

  updateLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateLevelDto.from({ ...req.body, id: req.params.id });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const level = await this._levelSvc.updateLevel(dto.id, dto);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level updated successfully");
  });

  deleteLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = DeleteLevelDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const level = await this._levelSvc.deleteLevel(dto.id);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level deleted successfully");
  });
}
