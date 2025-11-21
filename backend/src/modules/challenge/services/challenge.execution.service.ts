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
import { ChallengeIF } from "@shared/types";

import { runCodeWithJudge0, generateExecutableFiles, isEqual } from "@execution";
import { judge0Languages } from "@config/judge0.config";

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

  private mapBatchToUiResults(testCases: any[], batchResults: any[]) {
    return testCases.map((testCase, index) => {
      const batch = batchResults[index] || {
        success: false,
        error: "No result",
      };

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
        passed,
      };
    });
  }

  // -----------------------
  //   SINGLE TESTCASE RUN
  // -----------------------
  private async runAgainstTestcases(langId: number, testCases: any[], sourceCode: string) {
    const results = [];

    for (const tc of testCases) {
      const stdin = JSON.stringify({ args: tc.input || [] });

      const exec = await runCodeWithJudge0(
        langId,
        sourceCode,
        stdin
      );

      let parsed: any = {};
      try {
        parsed = JSON.parse(exec.stdout || "{}");
      } catch {
        parsed = { error: "Invalid JSON from runner" };
      }

      const actual = parsed.result;
      const passed = parsed.error ? false : isEqual(String(actual), String(tc.output));

      results.push({
        input: tc.input,
        expected: tc.output,
        actual,
        success: passed,
        error: parsed.error,
        raw: exec
      });
    }

    return results;
  }

  // -----------------------
  //   RUN CODE (Try Code)
  // -----------------------
  async runChallengeCode(
    challengeId: string,
    language: string,
    userCode: string,
    _input: string,
    userId: string
  ) {
    const challenge = await this.challengeRepo.getChallengeById(
      toObjectId(challengeId)
    );
    if (!challenge)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    if (challenge.type !== "code")
      throw new AppError(HttpStatus.BAD_REQUEST, "Challenge is not code type");

    if (!challenge.functionSignature)
      throw new AppError(HttpStatus.BAD_REQUEST, "Function signature missing");

    const testCases = challenge.testCases.slice(0, 3);
    const funcName = challenge.functionSignature.split("(")[0];

    const wrapperFiles = generateExecutableFiles(language, userCode, funcName);

    const sourceCode = wrapperFiles[0].content;

    const langMap: any = {
      javascript: 63,
      typescript: 74,
      python: 71,
      java: 62,
      go: 60,
      c: 50,
      cpp: 52,
      csharp: 51,
      ruby: 72,
      php: 68,
      dart: 90,
      rust: 73,
    };

    const langId = langMap[language.toLowerCase()];
    if (!langId) throw new Error("Unsupported language");

    const testResults = await this.runAgainstTestcases(langId, testCases, sourceCode);

    return {
      userId,
      challengeId,
      language,
      results: testResults
    };
  }

  // -----------------------
  //   SUBMIT CODE
  // -----------------------
  async submitChallenge(data: any, userId: string) {
    const { challengeId, userCode, language } = data;

    const challenge = await this.challengeRepo.getChallengeById(
      toObjectId(challengeId)
    );
    if (!challenge)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    const funcName = challenge.functionSignature.split("(")[0];
    const wrapperFiles = generateExecutableFiles(language, userCode, funcName);
    const sourceCode = wrapperFiles[0].content;


    
    const langId = judge0Languages[language.toLowerCase()];
    if (!langId) throw new Error("Unsupported language");

    const testResults = await this.runAgainstTestcases(
      langId,
      challenge.testCases,
      sourceCode
    );

    return {
      challengeId,
      userId,
      language,
      passed: testResults.every((r) => r.success),
      results: testResults,
    };
  }
}
