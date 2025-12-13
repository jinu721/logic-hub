import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IChallengeExecutionService,
  IChallengeRepository,
  ISubmissionRepository,
} from "@modules/challenge/interfaces";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs,
} from "@modules/challenge/dtos";
import { ChallengeDocument } from "@modules/challenge/models";

import {
  runCodeWithJudge0,
  generateExecutableFiles,
  judge0Languages,
  deepEqual,
} from "@execution";
import { ChallengeExecutionResult, ChallengeExecutionResultItem, ChallengeSubmitPayload, ParsedRunnerOutput, RunnerResult, SubmitChallengeResult, TestCaseIF } from "@shared/types";

export class ChallengeExecutionService
  extends BaseService<ChallengeDocument, PublicChallengeDTO>
  implements IChallengeExecutionService {
  constructor(
    private readonly challengeRepo: IChallengeRepository,
    private readonly submissionRepo: ISubmissionRepository
  ) {
    super();
  }

  protected toDTO(challenge: ChallengeDocument): PublicChallengeDTO {
    return toPublicChallengeDTO(challenge);
  }

  protected toDTOs(challenges: ChallengeDocument[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(challenges);
  }

  private parseOutput(stdout: string): ParsedRunnerOutput {
    try {
      return JSON.parse(stdout || "{}");
    } catch {
      return { error: "Invalid JSON from runner", rawOutput: stdout };
    }
  }

  private buildResults(
    parsed: ParsedRunnerOutput,
    testCases: TestCaseIF[]
  ): { results: ChallengeExecutionResultItem[]; allPassed: boolean } {
    const list = Array.isArray(parsed.results) ? parsed.results : [];

    const mapped: ChallengeExecutionResultItem[] = (
      list.length
        ? list
        : testCases.map((t: TestCaseIF) => ({
          input: t.input,
          expected: t.output,
          actual: null,
          error: parsed.error || "No runner results",
        }))
    ).map((r: RunnerResult): ChallengeExecutionResultItem => {
      const actual = r.actual ?? null;
      const expected = r.expected ?? null;
      const error = r.error ?? null;
      const passed = error ? false : deepEqual(actual, expected);
      return { input: r.input ?? null, expected, actual, error, passed };
    });

    return {
      results: mapped,
      allPassed: mapped.every((r) => r.passed),
    };
  }


  async runChallengeCode(
    challengeId: string,
    language: string,
    userCode: string,
    _input: string,
    userId: string
  ): Promise<ChallengeExecutionResult> {
    const challenge = await this.challengeRepo.getChallengeById(
      toObjectId(challengeId)
    );
    if (!challenge)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");
    if (challenge.type !== "code")
      throw new AppError(HttpStatus.BAD_REQUEST, "Challenge is not code type");
    if (!challenge.functionName)
      throw new AppError(HttpStatus.BAD_REQUEST, "Function signature missing");

    const testCases = (challenge.testCases || []).slice(0, 3);
    const funcName = challenge.functionName;

    const wrapperFiles = generateExecutableFiles(language, userCode, funcName);
    const sourceCode = wrapperFiles[0].content;

    const stdinPayload = JSON.stringify({
      funcName,
      testcases: testCases.map((t: TestCaseIF) => ({
        input: t.input ?? [],
        expected: t.output,
      })),
    });

    const langId = judge0Languages[(language || "").toLowerCase()];
    if (!langId)
      throw new AppError(HttpStatus.BAD_REQUEST, "Unsupported language");

    const exec = await runCodeWithJudge0(langId, sourceCode, stdinPayload);
    const parsed = this.parseOutput(exec.run?.stdout);

    const { results, allPassed } = this.buildResults(parsed, testCases);

    return {
      userId,
      challengeId,
      language,
      results,
      allPassed,
      rawExec: exec.raw ?? exec,
    };
  }

  async submitChallenge(
    data: ChallengeSubmitPayload,
    userId: string
  ): Promise<SubmitChallengeResult> {
    const { challengeId, userCode, language } = data;

    const challenge = await this.challengeRepo.getChallengeById(
      toObjectId(challengeId)
    );
    if (!challenge)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");
    if (!challenge.functionName)
      throw new AppError(HttpStatus.BAD_REQUEST, "Function signature missing");

    const funcName = challenge.functionName;
    const wrapperFiles = generateExecutableFiles(language, userCode, funcName);
    const sourceCode = wrapperFiles[0].content;

    const testCases = challenge.testCases || [];
    const stdinPayload = JSON.stringify({
      funcName,
      testcases: testCases.map((t: TestCaseIF) => ({
        input: t.input ?? [],
        expected: t.output,
      })),
    });

    const langId = judge0Languages[(language || "").toLowerCase()];
    if (!langId)
      throw new AppError(HttpStatus.BAD_REQUEST, "Unsupported language");

    const exec = await runCodeWithJudge0(langId, sourceCode, stdinPayload);

    const parsed = this.parseOutput(exec.run?.stdout);
    const { results, allPassed } = this.buildResults(parsed, testCases);

    const runTime = exec.run?.time ?? 0;
    const memoryUsed = exec.run?.memory ?? 0;
    const cpuTime = exec.run?.cpuTime ?? 0;
    const compileError = exec.run?.compileOutput ?? null;
    const judgeStatus = exec.run?.resultStatus ?? "pending";

    const passRatio = results.filter((r) => r.passed).length / results.length;
    const levelWeight =
      challenge.level === "master" ? 3 : challenge.level === "adept" ? 2 : 1;

    const score = Math.max(
      1,
      Math.round((passRatio * levelWeight * 2000) / (runTime + 1))
    );

    await this.submissionRepo.createSubmission({
      userId: userId,
      challengeId: challengeId,
      xpGained: challenge.xpRewards,
      passed: allPassed,
      score,
      timeTaken: runTime,
      type: challenge.type,
      level: challenge.level,
      tags: challenge.tags || [],
      challengeVersion: challenge.version || 1,
      status: allPassed
        ? "completed"
        : judgeStatus.includes("Time")
          ? "failed-timeout"
          : "failed-output",
      submittedAt: new Date(),
      execution: {
        language,
        codeSubmitted: userCode,
        resultOutput: parsed,
        testCasesPassed: results.filter((r) => r.passed).length,
        totalTestCases: results.length,
        runTime,
        memoryUsed,
        cpuTime,
        compileError,
      },
    });

    return {
      challengeId,
      userId,
      language,
      passed: allPassed,
      score,
      timeTaken: runTime,
      results,
      rawExec: exec.raw ?? exec,
    };
  }
}
