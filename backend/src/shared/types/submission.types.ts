import {  Types } from "mongoose";

export interface SubmissionAttrs {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;

  passed: boolean;
  xpGained: number;
  score: number;
  timeTaken: number;

  type: string;
  level: "novice" | "adept" | "master";
  tags: string[];
  challengeVersion: number;

  submittedAt: Date;
  status: "completed" | "failed-timeout" | "failed-output" | "pending";

  execution?: {
    language?: string;
    codeSubmitted?: string;
    resultOutput?: any;
    testCasesPassed?: number;
    totalTestCases?: number;

    runTime?: number;
    memoryUsed?: number;
    cpuTime?: number;
    compileError?: any;
  };
}
