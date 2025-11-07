import { Request, Response } from "express";
import { ILevelService, ILevelController } from "@modules/level";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class LevelController implements ILevelController {
  constructor(private readonly _levelSvc: ILevelService) {}

  updateUserLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const xp = req.body.xpPoints;

    if (!userId || xp === undefined) {
      throw new AppError(HttpStatus.BAD_REQUEST, "UserId and xpPoints are required");
    }

    const userLevel = await this._levelSvc.updateUserLevel(userId, xp);
    if (!userLevel) {
      throw new AppError(HttpStatus.NOT_FOUND, "User level could not be updated");
    }

    sendSuccess(res, HttpStatus.OK, userLevel, "User level updated successfully");
  });

  createLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const levelData = req.body;
    if (!levelData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Level data is required");
    }

    const level = await this._levelSvc.createLevel(levelData);
    sendSuccess(res, HttpStatus.CREATED, level, "Level created successfully");
  });

  getAllLevels = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const levels = await this._levelSvc.getAllLevels(page, limit);
    sendSuccess(res, HttpStatus.OK, levels, "Levels fetched successfully");
  });

  getLevelById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Level ID is required");
    }

    const level = await this._levelSvc.getLevelById(id);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level fetched successfully");
  });

  updateLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const levelData = req.body;

    if (!id || !levelData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Level ID and data are required");
    }

    const level = await this._levelSvc.updateLevel(id, levelData);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level updated successfully");
  });

  deleteLevel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Level ID is required");
    }

    const level = await this._levelSvc.deleteLevel(id);
    if (!level) {
      throw new AppError(HttpStatus.NOT_FOUND, "Level not found");
    }

    sendSuccess(res, HttpStatus.OK, level, "Level deleted successfully");
  });
}
