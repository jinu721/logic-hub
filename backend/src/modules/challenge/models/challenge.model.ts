import { Schema, model } from "mongoose";
import { ChallengeIF, TestCaseIF } from "@shared/types";

const testCaseSchema = new Schema<TestCaseIF>(
  {
    input: { type: [Schema.Types.Mixed], required: true },
    output: { type: Schema.Types.Mixed, required: true },
    isHidden: { type: Boolean, default: false },
  },
  {
    _id: false,
  }
);

const challengeDomainSchema = new Schema<ChallengeIF>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  type: { type: String, enum: ["code", "cipher"], required: true },
  level: { type: String, enum: ["novice", "adept", "master"], required: true },
  testCases: {
    type: [testCaseSchema],
    required: function () {
      return this.type === "code";
    },
  },
  timeLimit: { type: Number, required: true },
  tags: { type: [String], required: true },
  hints: { type: [String], required: true },
  requiredSkills: { type: [String], required: true },
  isPremium: { type: Boolean, required: true },
  isKeyRequired: { type: Boolean, required: true },
  functionSignature: { type: String },
  initialCode: { type: Schema.Types.Mixed },
  solutionCode: { type: Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["active", "inactive", "draft", "archived"],
    required: true,
  },
  isActive: { type: Boolean, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  xpRewards: { type: Number, required: true },
});

export const ChallengeModel = model<ChallengeIF>(
  "Challenges",
  challengeDomainSchema
);
