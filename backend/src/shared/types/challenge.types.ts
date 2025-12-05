import { Document } from "mongoose";

export type ChallengeLevel = "novice" | "adept" | "master";
export type ChallengeType = "code" | "cipher";

export interface TestCaseIF {
  input: unknown[];
  output: unknown;
  isHidden: boolean;
}

export interface ChallengeIF extends Document {
  title: string;
  instructions: string;
  type: ChallengeType;
  level: ChallengeLevel;
  testCases: TestCaseIF[];
  timeLimit: number;
  tags: string[];
  hints: string[];
  requiredSkills: string[];
  isPremium: boolean;
  isKeyRequired: boolean;
  functionName?: string;
  parameters?: { name: string; type: string }[];
  returnType?: string;
  initialCode?: string | { [language: string]: string };
  solutionCode?: string | { [language: string]: string };
  status: "active" | "inactive" | "draft" | "archived";
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  xpRewards: number;
  createdAt: Date;
}
