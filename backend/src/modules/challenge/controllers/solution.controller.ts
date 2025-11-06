import { Request, Response } from "express";
import { ISolutionController, ISolutionService } from "@modules/challenge";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class SolutionController implements ISolutionController {
  constructor(private readonly _solutionSvc: ISolutionService) {}

  createSolution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._solutionSvc.addSolution({
      ...req.body,
      user: userId,
    });

    sendSuccess(res, HttpStatus.CREATED, result, "Solution created successfully");
  });

  getSolutionsByChallenge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { search = "", page = "1", limit = "10", sortBy = "likes" } = req.query;

    const result = await this._solutionSvc.getSolutionsByChallenge(
      req.params.challengeId,
      search.toString(),
      parseInt(page.toString()),
      parseInt(limit.toString()),
      sortBy.toString()
    );

    sendSuccess(res, HttpStatus.OK, result, "Solutions fetched successfully");
  });

  getSolutionsByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const result = await this._solutionSvc.getSolutionsByUser(userId);
    sendSuccess(res, HttpStatus.OK, result, "Solutions fetched successfully");
  });

  likeSolution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const result = await this._solutionSvc.likeSolution(req.params.solutionId, userId);
    sendSuccess(res, HttpStatus.OK, result, "Solution liked successfully");
  });

  commentSolution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const { data } = req.body;
    if (!data) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Comment data is required");
    }

    const result = await this._solutionSvc.commentSolution(userId, data);
    sendSuccess(res, HttpStatus.OK, result, "Comment added successfully");
  });

  deleteComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { solutionId, commentId } = req.params;
    if (!solutionId || !commentId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Solution ID and Comment ID are required");
    }

    const result = await this._solutionSvc.deleteComment(solutionId, commentId);
    sendSuccess(res, HttpStatus.OK, result, "Comment deleted successfully");
  });

  updateSolution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { solutionId } = req.params;
    const data = req.body;

    if (!solutionId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Solution ID is required");
    }
    if (!data) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Update data is required");
    }

    const result = await this._solutionSvc.updateSolution(solutionId, data);
    sendSuccess(res, HttpStatus.OK, result, "Solution updated successfully");
  });

  deleteSolution  = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { solutionId } = req.params;
    if (!solutionId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Solution ID is required");
    }

    await this._solutionSvc.deleteSolution(solutionId);
    sendSuccess(res, HttpStatus.NO_CONTENT, null, "Solution deleted successfully");
  });
}
