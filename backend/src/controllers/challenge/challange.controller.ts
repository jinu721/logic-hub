import { IChallengeController } from "./challange.controller.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import { IChallengeService } from "../../services/interfaces/challange.service.interface";
import { sendSuccess } from "../../utils/application/response.util";
import { asyncHandler } from "../../utils/application/async.handler";
import { AppError } from "../../utils/application/app.error";

interface RunCodeRequest {
  challengeId: string;
  language: string;
  sourceCode: string;
  input: string;
  userId: string;
}

export class ChallengeController implements IChallengeController {
  constructor(private readonly _challengeSvc: IChallengeService) {}

  createChallenge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    if(!data) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid request data");
    }
    const challenge = await this._challengeSvc.createChallenge(data);
    sendSuccess(res, HttpStatus.CREATED, challenge, "Challenge created successfully");
  });

  getChallengeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const challengeId = req.params.id;
    if(!challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid request data");
    }
    const challenge = await this._challengeSvc.getChallengeById(challengeId, userId);
    sendSuccess(res, HttpStatus.OK, challenge, "Challenge fetched successfully");
  });

  getChallenges = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const result = await this._challengeSvc.getChallenges(req.query, userId);
    sendSuccess(res, HttpStatus.OK, result, "Challenges fetched successfully");
  });

  getAllChallenges = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const challenges = await this._challengeSvc.getAllChallenges(
      search as string,
      page,
      limit
    );
    sendSuccess(res, HttpStatus.OK, challenges, "All challenges fetched successfully");
  });

  updateChallenge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const challengeId = req.params.id;
    const updateData = req.body;
    if (!challengeId || !updateData) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid request data");
    }
    const updatedChallenge = await this._challengeSvc.updateChallenge(challengeId, updateData);
    sendSuccess(res, HttpStatus.OK, updatedChallenge, "Challenge updated successfully");
  });

  deleteChallenge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const challengeId = req.params.id;
    if (!challengeId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid request data");
    }
    await this._challengeSvc.deleteChallenge(challengeId);
    sendSuccess(res, HttpStatus.OK, null, "Challenge deleted successfully");
  });

  getChallengesByStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const status = req.params.status;
    if (!status) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid status");
    }
    const challenges = await this._challengeSvc.getChallengesByStatus(
      status as "active" | "inactive" | "draft" | "archived"
    );
    sendSuccess(res, HttpStatus.OK, challenges, "Challenges fetched successfully by status");
  });

  getChallengesByTags = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tags = req.body.tags;
    if (!tags) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid tags");
    }
    const challenges = await this._challengeSvc.getChallengesByTags(tags);
    sendSuccess(res, HttpStatus.OK, challenges, "Challenges fetched successfully by tags");
  });

  getChallengesByDifficulty = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const difficulty = req.params.difficulty;
    if (!difficulty) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid difficulty");
    }
    const challenges = await this._challengeSvc.getChallengesByDifficulty(
      difficulty as "novice" | "adept" | "master"
    );
    sendSuccess(res, HttpStatus.OK, challenges, "Challenges fetched successfully by difficulty");
  });

  runChallengeCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const { challengeId, language, sourceCode, input }: RunCodeRequest = req.body;
    if (!userId || !challengeId || !language || !sourceCode || !input) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid request data");
    }
    const result = await this._challengeSvc.runChallengeCode(
      challengeId,
      language,
      sourceCode,
      input,
      userId
    );
    sendSuccess(res, HttpStatus.OK, result, "Challenge code executed successfully");
  });

  submitChallenge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const result = await this._challengeSvc.submitChallenge(req.body, userId);
    sendSuccess(res, HttpStatus.OK, result, "Challenge submitted successfully");
  });
}
