import { Request, Response } from "express";
import { ISubmissionController, ISubmissionService } from "@modules/challenge";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError, toObjectId } from "@utils/application";
import {
  CreateSubmissionRequestDto,
  GetHeatmapRequestDto,
  UpdateSubmissionDto,
  DeleteSubmissionDto,
  SubmissionsUserChallengeDto,
  SubmissionIdDto,
  SubmissionsByUserDto,
  SubmissionsByChallengeDto
} from "@modules/challenge/dtos";


export class SubmissionController implements ISubmissionController {
  constructor(private readonly _submissionSvc: ISubmissionService) { }

  createSubmission = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = CreateSubmissionRequestDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const createdSubmission = await this._submissionSvc.createSubmission({
      ...dto,
      userId
    });

    sendSuccess(res, HttpStatus.CREATED, createdSubmission, "Submission created successfully");
  });
  getSubmissionsByUserAndChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = SubmissionsUserChallengeDto.from({
      userId: req.params.userId,
      challengeId: req.params.challengeId
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const submissions = await this._submissionSvc.getSubmissionsByUserAndChallenge(dto);
    sendSuccess(res, HttpStatus.OK, submissions);
  });


  getSubmissionById = asyncHandler(async (req, res): Promise<void> => {
    const dto = SubmissionIdDto.from({ id: req.params.id });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const submission = await this._submissionSvc.getSubmissionById(dto.id);
    sendSuccess(res, HttpStatus.OK, submission);
  });


  getAllSubmissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const submissions = await this._submissionSvc.getAllSubmissions();
    sendSuccess(res, HttpStatus.OK, submissions, "All submissions fetched successfully");
  });

  getRecentSubmissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.username;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const targetUserId = req.params.input === "me" ? userId : req.params.input;
    const submissions = await this._submissionSvc.getRecentSubmissions(targetUserId);
    sendSuccess(res, HttpStatus.OK, submissions, "Recent submissions fetched successfully");
  });

  updateSubmission = asyncHandler(async (req, res): Promise<void> => {
    const dto = UpdateSubmissionDto.from({
      id: req.params.id,
      payload: req.body
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const updated = await this._submissionSvc.updateSubmission(dto.id, dto.payload);
    sendSuccess(res, HttpStatus.OK, updated);
  });


  deleteSubmission = asyncHandler(async (req, res): Promise<void> => {
    const dto = DeleteSubmissionDto.from({ id: req.params.id });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this._submissionSvc.deleteSubmissionById(dto.id);
    sendSuccess(res, HttpStatus.OK, result);
  });


  getAllSubmissionsByUser = asyncHandler(async (req, res): Promise<void> => {
    const dto = SubmissionsByUserDto.from({ userId: req.params.userId || req.user?.userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const submissions = await this._submissionSvc.getAllSubmissionsByUser(dto.userId);
    sendSuccess(res, HttpStatus.OK, submissions);
  });

  getAllSubmissionsByChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = SubmissionsByChallengeDto.from({ challengeId: req.params.challengeId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const submissions = await this._submissionSvc.getAllSubmissionsByChallenge(dto.challengeId);
    sendSuccess(res, HttpStatus.OK, submissions);
  });

  getHeatmap = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loggedUserId = req.user?.userId;
    if (!loggedUserId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const userParam = req.params.userId;
    const userId = userParam === "me" ? loggedUserId : userParam;
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");

    const dto = GetHeatmapRequestDto.from({
      year: req.query.year ? Number(req.query.year) : undefined,
      userId
    });

    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const year = dto.year ?? new Date().getFullYear();

    const progress = await this._submissionSvc.getUserHeatmapData(dto.userId as string, year);
    sendSuccess(res, HttpStatus.OK, progress, "User heatmap data fetched successfully");
  });
}
