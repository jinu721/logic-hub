import { ChallengeProgressIF } from "../shared/types/submission.types";

export interface PublicChallengeProgressDTO {
  _id: string;
  userId: string;
  challengeId: string;
  passed: boolean;
  xpGained: number;
  timeTaken: number;
  type: string;
  level: "novice" | "adept" | "master";
  tags: string[];
  submittedAt: Date;
  status: "completed" | "failed-timeout" | "failed-output" | "pending";
  execution?: {
    language?: string;
    codeSubmitted?: string;
    resultOutput?: any;
    testCasesPassed?: number;
    totalTestCases?: number;
  };
}


export const toPublicProgressDTO = (
  progress: ChallengeProgressIF
): PublicChallengeProgressDTO => {
  return {
    _id: progress._id ? progress?._id.toString() : "",
    userId: progress.userId.toString(),
    challengeId: progress.challengeId.toString(),
    passed: progress.passed,
    xpGained: progress.xpGained,
    timeTaken: progress.timeTaken,
    type: progress.type,
    level: progress.level,
    tags: progress.tags,
    submittedAt: progress.submittedAt,
    status: progress.status,
    execution: progress.execution
      ? {
          language: progress.execution.language,
          codeSubmitted: progress.execution.codeSubmitted,
          resultOutput: progress.execution.resultOutput,
          testCasesPassed: progress.execution.testCasesPassed,
          totalTestCases: progress.execution.totalTestCases,
        }
      : undefined,
  };
};

export const toPublicProgressDTOs = (
  progressList: ChallengeProgressIF[]
): PublicChallengeProgressDTO[] => {
  return progressList.map(toPublicProgressDTO);
};