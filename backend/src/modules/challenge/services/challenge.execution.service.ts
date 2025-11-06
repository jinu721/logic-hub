import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IChallengeExecutionService,
  IChallengeRepository,
  ISubmissionRepository
} from "@modules/challenge/interfaces";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs
} from "@modules/challenge/dtos";
import { ChallengeIF } from "@shared/types";
import { generateExecutableCode } from "@utils/execution/generate.executable.code";
import { runInWorkerThread } from "@worker/run.worker";
import { isEqual } from "@utils/execution/compare.helper";

export class ChallengeExecutionService
  extends BaseService<ChallengeIF, PublicChallengeDTO>
  implements IChallengeExecutionService
{
  constructor(
    private readonly challengeRepo: IChallengeRepository,
    private readonly progressRepo: ISubmissionRepository
  ) {
    super();
  }

  protected toDTO(challenge: ChallengeIF): PublicChallengeDTO {
    return toPublicChallengeDTO(challenge);
  }

  protected toDTOs(challenges: ChallengeIF[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(challenges);
  }

  async runChallengeCode(
    challengeId: string,
    language: string,
    sourceCode: string,
    input: string,
    userId: string
  ) {
    const challenge = await this.challengeRepo.getChallengeById(challengeId);
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");
    if (challenge.type !== "code")
      throw new AppError(HttpStatus.BAD_REQUEST, "Challenge is not code type");

    if (!challenge.functionSignature)
      throw new AppError(HttpStatus.BAD_REQUEST, "Function signature missing");

    const testCases = challenge.testCases?.slice(0, 3) || [];
    const funcName = challenge.functionSignature.split("(")[0];

    const fullSource = generateExecutableCode(
      language,
      sourceCode,
      funcName,
      testCases
    );

    const executionResult = await runInWorkerThread(language, fullSource, input || "");
    const rawOutput = executionResult.run?.stdout || "";

    let parsed: any[] = [];
    try {
      parsed = JSON.parse(rawOutput.trim());
    } catch {
      parsed = testCases.map((_, idx) => ({
        success: false,
        error: `Failed to execute test case ${idx + 1}`,
      }));
    }

    return {
      userId,
      challengeId,
      language,
      results: parsed
    };
  }

  async submitChallenge(data: any, userId: string) {
    // THIS VERSION ONLY EXECUTES CODE + RETURNS RESULT
    // STATS (xp, streak) WILL BE IN ChallengeStatsService

    const { challengeId, userCode, language } = data;

    const challenge = await this.challengeRepo.getChallengeById(challengeId);
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    if (challenge.type !== "code")
      throw new AppError(HttpStatus.BAD_REQUEST, "Unsupported challenge type");

    const funcName = challenge.functionSignature?.split("(")[0];
    const fullSource = generateExecutableCode(language, userCode, funcName, challenge.testCases);

    const executionResult = await runInWorkerThread(language, fullSource, "");
    const stdout = executionResult.run?.stdout || "";

    let batchResults: any[] = [];
    try {
      batchResults = JSON.parse(stdout.trim());
    } catch {
      batchResults = challenge.testCases.map((_, index) => ({
        success: false,
        error: `Failed to execute #${index + 1}`,
      }));
    }

    const results = challenge.testCases.map((testCase, index) => {
      const batch = batchResults[index];
      let passed = false;
      let actualOutput = "";

      if (batch.success) {
        const expected = String(testCase.output).trim();
        actualOutput = String(batch.result || "").trim();
        passed = isEqual(expected, actualOutput);
      } else {
        actualOutput = batch.error || "Execution failed";
      }

      return {
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput,
        passed
      };
    });

    return {
      challengeId,
      userId,
      language,
      passed: results.every(r => r.passed),
      results
    };
  }
}
