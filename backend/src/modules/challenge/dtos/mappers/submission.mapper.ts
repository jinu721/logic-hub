import { PublicSubmissionDTO } from "@modules/challenge/dtos";
import { SubmissionDocument } from "@shared/types";

export const toPublicSubmissionDTO = (
  submission: SubmissionDocument
): PublicSubmissionDTO => {
  return {
    _id: submission._id ? submission?._id.toString() : "",
    userId: submission.userId.toString(),
    challengeId: submission.challengeId.toString(),
    passed: submission.passed,
    xpGained: submission.xpGained,
    timeTaken: submission.timeTaken,
    type: submission.type,
    level: submission.level,
    tags: submission.tags,
    submittedAt: submission.submittedAt,
    status: submission.status,
    execution: submission.execution
      ? {
          language: submission.execution.language,
          codeSubmitted: submission.execution.codeSubmitted,
          resultOutput: submission.execution.resultOutput,
          testCasesPassed: submission.execution.testCasesPassed,
          totalTestCases: submission.execution.totalTestCases,
        }
      : undefined,
  };
};

export const toPublicSubmissionDTOs = (
  submissionList: SubmissionDocument[]
): PublicSubmissionDTO[] => {
  return submissionList.map(toPublicSubmissionDTO);
};