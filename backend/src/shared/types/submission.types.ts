import { Document, Types } from "mongoose";

export interface SubmissionIF extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
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
