import { HttpStatus } from "@constants";
import { 
  IChallengeController,
  IChallengeQueryService,
  IChallengeCommandService,
  IChallengeExecutionService,
  IChallengeStatsService
 } from "@modules/challenge";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";

interface RunCodeRequest {
  challengeId: string;
  language: string;
  sourceCode: string;
  input: string;
  userId: string;
}

export class ChallengeController implements IChallengeController {
  constructor(
    private readonly querySvc: IChallengeQueryService,
    private readonly commandSvc: IChallengeCommandService,
    private readonly execSvc: IChallengeExecutionService,
    private readonly statsSvc: IChallengeStatsService
  ) {}


  getChallengeById = asyncHandler(async (req, res) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    const id = req.params.id;

    const result = await this.querySvc.getChallengeById(id, userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  getChallenges = asyncHandler(async (req, res) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const result = await this.querySvc.getChallenges(req.query, userId);
    sendSuccess(res, HttpStatus.OK, result);
  });

  createChallenge = asyncHandler(async (req, res) => {
    const data = req.body;
    const result = await this.commandSvc.createChallenge(data);
    sendSuccess(res, HttpStatus.CREATED, result);
  });

  updateChallenge = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const result = await this.commandSvc.updateChallenge(id, body);
    sendSuccess(res, HttpStatus.OK, result);
  });

  deleteChallenge = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await this.commandSvc.deleteChallenge(id);
    sendSuccess(res, HttpStatus.OK, null);
  });


  // --- CODE EXECUTION -------------------------------------------

  runChallengeCode = asyncHandler(async (req, res) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const { challengeId, language, sourceCode, input } = req.body;

    const result = await this.execSvc.runChallengeCode(
      challengeId,
      language,
      sourceCode,
      input,
      userId
    );

    sendSuccess(res, HttpStatus.OK, result);
  });


  // --- SUBMIT (EXECUTE + APPLY XP/STATS) -------------------------

  submitChallenge = asyncHandler(async (req, res) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const execResult = await this.execSvc.submitChallenge(req.body, userId);
    const statsResult = await this.statsSvc.applySubmissionEffects(execResult, userId);

    const response = { ...execResult, ...statsResult };

    sendSuccess(res, HttpStatus.OK, response);
  });
}
