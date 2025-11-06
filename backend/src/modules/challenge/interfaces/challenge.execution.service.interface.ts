export interface IChallengeExecutionService {
  runChallengeCode(
    challengeId: string,
    language: string,
    sourceCode: string,
    input: string,
    userId: string
  ): Promise<any>;

  submitChallenge(data: any, userId: string): Promise<any>;
}
