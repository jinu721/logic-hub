import { Document, Schema, model } from "mongoose";
import { SubmissionAttrs } from "@shared/types";

export interface SubmissionDocument extends SubmissionAttrs, Document {}


const SubmissionSchema = new Schema<SubmissionDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  challengeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Challenges",
  },

  passed: { type: Boolean, required: true },
  xpGained: { type: Number, required: true },

  score: { type: Number, required: true },
  timeTaken: { type: Number, required: true },

  level: { type: String, enum: ["novice", "adept", "master"], required: true },
  type: { type: String, required: true },
  tags: { type: [String], required: true },

  challengeVersion: { type: Number, default: 1 },

  submittedAt: { type: Date, default: Date.now, required: true },
  status: {
    type: String,
    enum: ["completed", "failed-timeout", "failed-output", "pending"],
    required: true,
  },

  execution: {
    language: { type: String },
    codeSubmitted: { type: String },
    resultOutput: { type: Schema.Types.Mixed },
    testCasesPassed: { type: Number },
    totalTestCases: { type: Number },

    runTime: { type: Number },
    memoryUsed: { type: Number },
    cpuTime: { type: Number },
    compileError: { type: Schema.Types.Mixed },
  },
});

export const SubmissionModel = model<SubmissionDocument>(
  "Submission",
  SubmissionSchema
);
