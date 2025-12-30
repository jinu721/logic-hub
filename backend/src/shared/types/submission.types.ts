import {  Document, Types } from "mongoose";


export interface TestCaseExecutionResult {
  input?: unknown;
  expected?: unknown;
  actual?: unknown;
  error?: string | null;
  passed?: boolean;
}



export interface ChallengeExecutionResultItem {
  input: unknown;
  expected: unknown;
  actual: unknown;
  error: string | null;
  passed: boolean;
}

export interface ChallengeExecutionResult {
  userId: string;
  challengeId: string;
  language: string;
  results: ChallengeExecutionResultItem[];
  allPassed: boolean;
  rawExec: unknown;
}

export interface SubmitChallengeResult {
  challengeId: string;
  userId: string;
  language: string;
  passed: boolean;
  score: number;
  timeTaken: number;
  results: ChallengeExecutionResultItem[];
  rawExec: unknown;
  xpGained: number;
  newLevel?: number;
}


export interface RunnerResult {
  input?: unknown[] | null;
  expected?: unknown | null;
  actual?: unknown | null;

  error?: string | null;
}

export interface ParsedRunnerOutput {
  results?: RunnerResult[];
  error?: string;
  rawOutput?: string;
}

export type ParsedValue =
  | string
  | number
  | boolean
  | null
  | unknown[]
  | Record<string, unknown>;


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
    resultOutput?: TestCaseExecutionResult[] | { error?: string; rawOutput?: string } | null;
    testCasesPassed?: number;
    totalTestCases?: number;

    runTime?: number;
    memoryUsed?: number;
    cpuTime?: number;
    compileError?: string | null;
  };
}

export interface SubmissionDocument extends SubmissionAttrs, Document {}

export interface CreateSubmissionPayload {
  challengeId: string;
  userId: string;
  userCode: string;
  language: string;
}

export interface ChallengeSubmitPayload {
  challengeId: string;
  userCode: string;
  language: string;
}

export interface ExecutionResultOutput {
  results?: TestCaseExecutionResult[];
  error?: string;
  rawOutput?: string;
}


export interface CreateSubmissionInput {
  challengeId: string;
  userId: string;
  passed: boolean;
  xpGained: number;
  score: number;
  timeTaken: number;
  level: "novice" | "adept" | "master";
  type: string;
  tags: string[];
  challengeVersion: number;
  submittedAt: Date;
  status: "completed" | "failed-timeout" | "failed-output" | "pending";
  execution?: {
    language?: string;
    codeSubmitted?: string;
    resultOutput?: ExecutionResultOutput | null;
    testCasesPassed?: number;
    totalTestCases?: number;
    runTime?: number;
    memoryUsed?: number;
    cpuTime?: number;
    compileError?: string | null;
  };
}

export interface UpdateSubmissionPayload {
  challengeId: string;
  userId: string;
  userCode: string;
  language: string;
}

export interface SubmissionUpdatePayload {
  
}

export interface SubmissionWithChallenge {
  challengeId: Types.ObjectId;
  status: "completed" | "failed-timeout" | "failed-output" | "pending";
}




