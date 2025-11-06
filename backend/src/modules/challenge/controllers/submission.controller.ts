import { Request, Response } from "express";
import { ISubmissionController, ISubmissionService } from "@modules/challenge";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class SubmissionController implements ISubmissionController {
  constructor(private readonly _submissionSvc: ISubmissionService) {}

  createSubmission = asyncHandler(async (req: Request, res: Response) => {
    const submissionData = req.body;
    if (!submissionData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Submission data is required");
    }

    const createdSubmission = await this._submissionSvc.createSubmission(submissionData);
    sendSuccess(res, HttpStatus.CREATED, createdSubmission, "Submission created successfully");
  });

  getSubmissionsByUserAndChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { userId, challengeId } = req.params;
    if (!userId || !challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID and Challenge ID are required");
    }

    const submissions = await this._submissionSvc.getSubmissionsByUserAndChallenge({ userId, challengeId });
    sendSuccess(res, HttpStatus.OK, submissions, "Submissions fetched successfully");
  });

  getSubmissionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Submission ID is required");
    }

    const submission = await this._submissionSvc.getSubmissionById(id);
    sendSuccess(res, HttpStatus.OK, submission, "Submission fetched successfully");
  });

  getAllSubmissions = asyncHandler(async (req: Request, res: Response) => {
    const submissions = await this._submissionSvc.getAllSubmissions();
    sendSuccess(res, HttpStatus.OK, submissions, "All submissions fetched successfully");
  });

  getRecentSubmissions = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.username;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const targetUserId = req.params.input === "me" ? userId : req.params.input;
    const submissions = await this._submissionSvc.getRecentSubmissions(targetUserId);
    sendSuccess(res, HttpStatus.OK, submissions, "Recent submissions fetched successfully");
  });

  updateSubmission = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const submissionData = req.body;
    if (!id || !submissionData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Submission ID and data are required");
    }

    const updatedSubmission = await this._submissionSvc.updateSubmission(id, submissionData);
    sendSuccess(res, HttpStatus.OK, updatedSubmission, "Submission updated successfully");
  });

  deleteSubmission = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Submission ID is required");
    }

    const result = await this._submissionSvc.deleteSubmissionById(id);
    sendSuccess(res, HttpStatus.OK, result, "Submission deleted successfully");
  });

  getAllSubmissionsByUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = (req as any).user?.userId;
    if (!currentUserId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const userId = req.params.userId || currentUserId;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const submissions = await this._submissionSvc.getAllSubmissionsByUser(userId);
    sendSuccess(res, HttpStatus.OK, submissions, "User submissions fetched successfully");
  });

  getAllSubmissionsByChallenge = asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    if (!challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Challenge ID is required");
    }

    const submissions = await this._submissionSvc.getAllSubmissionsByChallenge(challengeId);
    sendSuccess(res, HttpStatus.OK, submissions, "Challenge submissions fetched successfully");
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

    const progress = await this._submissionSvc.getUserHeatmapData(userId, year);
    sendSuccess(res, HttpStatus.OK, progress, "User heatmap data fetched successfully");
  });
}
