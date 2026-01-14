"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicSubmissionDTOs = exports.toPublicSubmissionDTO = void 0;
const toPublicSubmissionDTO = (submission) => {
    return {
        _id: submission._id ? submission === null || submission === void 0 ? void 0 : submission._id.toString() : "",
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
                resultOutput: submission.execution.resultOutput
                    ? (Array.isArray(submission.execution.resultOutput)
                        ? submission.execution.resultOutput
                        : submission.execution.resultOutput.error
                            ? { error: submission.execution.resultOutput.error, rawOutput: submission.execution.resultOutput.rawOutput }
                            : { error: "Unknown error", rawOutput: submission.execution.resultOutput.rawOutput })
                    : null,
                testCasesPassed: submission.execution.testCasesPassed,
                totalTestCases: submission.execution.totalTestCases,
            }
            : undefined,
    };
};
exports.toPublicSubmissionDTO = toPublicSubmissionDTO;
const toPublicSubmissionDTOs = (submissionList) => {
    return submissionList.map(exports.toPublicSubmissionDTO);
};
exports.toPublicSubmissionDTOs = toPublicSubmissionDTOs;
