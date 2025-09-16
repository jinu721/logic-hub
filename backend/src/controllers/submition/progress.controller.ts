import { Request, Response } from "express";
import { IChallengeProgressController } from "./progress.controller.interface";
import { IChallengeProgressService } from "../../services/interfaces/progress.service.interface";
import { HttpStatus } from "../../constants/http.status";
import { sendSuccess } from "../../utils/application/response.util";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

export class ChallengeProgressController implements IChallengeProgressController {
  constructor(private readonly _progressSvc: IChallengeProgressService) {}

  createProgress = asyncHandler(async (req: Request, res: Response) => {
    const progressData = req.body;
    if (!progressData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Progress data is required");
    }

    const createdProgress = await this._progressSvc.createProgress(progressData);
    sendSuccess(res, HttpStatus.CREATED, createdProgress, "Progress created successfully");
  });

  getProgressByUserAndChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { userId, challengeId } = req.params;
    if (!userId || !challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID and Challenge ID are required");
    }

    const progress = await this._progressSvc.getProgressByUserAndChallenge({ userId, challengeId });
    sendSuccess(res, HttpStatus.OK, progress, "Progress fetched successfully");
  });

  getProgressById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Progress ID is required");
    }

    const progress = await this._progressSvc.getProgressById(id);
    sendSuccess(res, HttpStatus.OK, progress, "Progress fetched successfully");
  });

  getAllProgress = asyncHandler(async (req: Request, res: Response) => {
    const progresses = await this._progressSvc.getAllProgress();
    sendSuccess(res, HttpStatus.OK, progresses, "All progress fetched successfully");
  });

  getRecentProgress = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.username;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const targetUserId = req.params.input === "me" ? userId : req.params.input;
    const progress = await this._progressSvc.getRecentProgress(targetUserId);
    sendSuccess(res, HttpStatus.OK, progress, "Recent progress fetched successfully");
  });

  updateProgress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const progressData = req.body;
    if (!id || !progressData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Progress ID and data are required");
    }

    const updatedProgress = await this._progressSvc.updateProgress(id, progressData);
    sendSuccess(res, HttpStatus.OK, updatedProgress, "Progress updated successfully");
  });

  deleteProgress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Progress ID is required");
    }

    const result = await this._progressSvc.deleteProgressById(id);
    sendSuccess(res, HttpStatus.OK, result, "Progress deleted successfully");
  });

  getAllProgressByUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user?.userId;
    if (!currentUserId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const userId = req.params.userId || currentUserId;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const progress = await this._progressSvc.getAllProgressByUser(userId);
    sendSuccess(res, HttpStatus.OK, progress, "User progress fetched successfully");
  });

  getAllProgressByChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    if (!challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Challenge ID is required");
    }

    const progress = await this._progressSvc.getAllProgressByChallenge(challengeId);
    sendSuccess(res, HttpStatus.OK, progress, "Challenge progress fetched successfully");
  });

  getHeatmap = asyncHandler(async (req: Request, res: Response) => {
    const year = req.query.year ? Number(req.query.year) : 2025;
    if (!year) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Year is required");
    }

    const userId = req.params.userId === "me" ? (req as any).user?.userId : req.params.userId;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Username is required");
    }

    const progress = await this._progressSvc.getUserHeatmapData(userId, year);
    sendSuccess(res, HttpStatus.OK, progress, "User heatmap data fetched successfully");
  });
}
