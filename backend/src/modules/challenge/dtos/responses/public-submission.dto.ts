import { TestCaseExecutionResult } from "@shared/types";

export interface PublicSubmissionDTO {
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
    resultOutput?: TestCaseExecutionResult[] | { error: string; rawOutput?: string } | null;
    testCasesPassed?: number;
    totalTestCases?: number;
  };
}