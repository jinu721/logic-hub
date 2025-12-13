import { ChallengeExecutionResult, SubmitChallengeResult } from "@shared/types";

export interface IChallengeExecutionService {
  runChallengeCode(
    challengeId: string,
    language: string,
    sourceCode: string,
    input: string,
    userId: string
  ): Promise<ChallengeExecutionResult>;

  submitChallenge(
    data: {
      challengeId: string;
      userCode: string;
      language: string;
    },
    userId: string
  ): Promise<SubmitChallengeResult>;
}
