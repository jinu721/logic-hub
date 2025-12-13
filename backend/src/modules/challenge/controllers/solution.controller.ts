import { ISolutionController, ISolutionService } from "@modules/challenge";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";
import {
  CreateSolutionRequestDto,
  SolutionQueryDto,
  CommentSolutionRequestDto,
  UpdateSolutionDto
} from "@modules/challenge/dtos";
import { SolutionUserQueryDto } from "../dtos/requests/solution-user-query.dto";
import { LikeSolutionDto } from "../dtos/requests/like-solution.dto";
import { DeleteCommentDto } from "../dtos/requests/delete-comment.dto";

export class SolutionController implements ISolutionController {
  constructor(private readonly _solutionSvc: ISolutionService) { }

  createSolution = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = CreateSolutionRequestDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this._solutionSvc.addSolution({
      ...dto,
      user: userId,
    });

    sendSuccess(res, HttpStatus.CREATED, result);
  });

  getSolutionsByChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = SolutionQueryDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this._solutionSvc.getSolutionsByChallenge(
      req.params.challengeId,
      dto.search,
      dto.page,
      dto.limit,
      dto.sortBy
    );

    sendSuccess(res, HttpStatus.OK, result);
  });

  getSolutionsByUser = asyncHandler(async (req, res): Promise<void> => {
    const dto = SolutionUserQueryDto.from({ userId: req.params.userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));
    const result = await this._solutionSvc.getSolutionsByUser(dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  likeSolution = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = LikeSolutionDto.from({ solutionId: req.params.solutionId, userId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this._solutionSvc.likeSolution(dto.solutionId, dto.userId);
    sendSuccess(res, HttpStatus.OK, result);
  });


  commentSolution = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = CommentSolutionRequestDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this._solutionSvc.commentSolution(userId, dto);
    sendSuccess(res, HttpStatus.OK, result);
  });

  deleteComment = asyncHandler(async (req, res): Promise<void> => {
    const dto = DeleteCommentDto.from({
      solutionId: req.params.solutionId,
      commentId: req.params.commentId,
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this._solutionSvc.deleteComment(dto.solutionId, dto.commentId);
    sendSuccess(res, HttpStatus.OK, result);
  });


  updateSolution = asyncHandler(async (req, res): Promise<void> => {
    const dto = UpdateSolutionDto.from({
      solutionId: req.params.solutionId,
      payload: req.body,
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this._solutionSvc.updateSolution(dto.solutionId, dto.payload);
    sendSuccess(res, HttpStatus.OK, result);
  });


  deleteSolution = asyncHandler(async (req, res): Promise<void> => {
    await this._solutionSvc.deleteSolution(req.params.solutionId);
    sendSuccess(res, HttpStatus.NO_CONTENT, null);
  });
}
