import {  Types } from "mongoose";


export interface TestCaseExecutionResult {
  input?: unknown;
  expected?: unknown;
  actual?: unknown;
  error?: string | null;
  passed?: boolean;
}

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
    resultOutput?: TestCaseExecutionResult[] | { error: string; rawOutput?: string } | null;
    testCasesPassed?: number;
    totalTestCases?: number;

    runTime?: number;
    memoryUsed?: number;
    cpuTime?: number;
    compileError?: string | null;
  };
}

export interface SubmissionDocument extends SubmissionAttrs, Document {}

export interface CreateSubmissionInput {
  challengeId: string;
  userId: string;
  userCode: string;
  language: string;
}

export interface SubmissionWithChallenge {
  challengeId: Types.ObjectId;
  status: "completed" | "failed-timeout" | "failed-output" | "pending";
}


