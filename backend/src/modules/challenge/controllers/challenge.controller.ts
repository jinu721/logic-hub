import { HttpStatus } from "@constants";
import {
  IChallengeController,
  IChallengeQueryService,
  IChallengeCommandService,
  IChallengeExecutionService,
  IChallengeStatsService
} from "@modules/challenge";
import { sendSuccess, asyncHandler, AppError, toObjectId } from "@utils/application";

import {
  UserHomeFiltersDto,
  GetAllChallengesDto,
  RunCodeRequestDto,
  SubmitChallengeDto,
  CreateChallengeRequestDto,
  GetChallengeByIdDto,
  UpdateChallengeDto,
  DeleteChallengeDto
} from "@modules/challenge/dtos";

export class ChallengeController implements IChallengeController {
  constructor(
    private readonly querySvc: IChallengeQueryService,
    private readonly commandSvc: IChallengeCommandService,
    private readonly execSvc: IChallengeExecutionService,
    private readonly statsSvc: IChallengeStatsService
  ) { }

  getChallengeById = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = GetChallengeByIdDto.from({ challengeId: req.params.challengeId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this.querySvc.getChallengeById(dto.challengeId, userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  getUserHomeChallenges = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = UserHomeFiltersDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this.querySvc.getUserHomeChallenges(dto, userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  getAllChallenges = asyncHandler(async (req, res): Promise<void> => {
    const dto = GetAllChallengesDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this.querySvc.getAllChallenges(dto.search, dto.page, dto.limit);
    sendSuccess(res, HttpStatus.OK, result);
  });

  createChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = CreateChallengeRequestDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    const result = await this.commandSvc.createChallenge(dto);
    sendSuccess(res, HttpStatus.CREATED, result);
  });

  updateChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = UpdateChallengeDto.from({
      challengeId: req.params.challengeId,
      payload: req.body
    });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    const result = await this.commandSvc.updateChallenge(dto.challengeId, dto.payload);
    sendSuccess(res, HttpStatus.OK, result);
  });

  deleteChallenge = asyncHandler(async (req, res): Promise<void> => {
    const dto = DeleteChallengeDto.from({ challengeId: req.params.challengeId });
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors?.join(", "));

    await this.commandSvc.deleteChallenge(toObjectId(dto.challengeId));
    sendSuccess(res, HttpStatus.OK, null);
  });

  runChallengeCode = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = RunCodeRequestDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const result = await this.execSvc.runChallengeCode(
      dto.challengeId, dto.language, dto.sourceCode, dto.input, userId
    );

    sendSuccess(res, HttpStatus.OK, result);
  });

  submitChallenge = asyncHandler(async (req, res): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const dto = SubmitChallengeDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const execResult = await this.execSvc.submitChallenge(dto, userId);
    const statsResult = await this.statsSvc.applySubmissionEffects(execResult, userId);

    sendSuccess(res, HttpStatus.OK, { ...execResult, ...statsResult });
  });
}
