import { Document } from "mongoose";

// Req Query Params : {"type":["code"],"isPremium":"false",,"timeLimit":"[object Object]","xpRewards":"[object Object]","searchQuery":""}

export type ChallengeLevel = "novice" | "adept" | "master";
export type ChallengeType = "code" | "cipher";

export interface TestCaseIF {
  input: any[];
  output: any;
  isHidden?: boolean;
}

export interface ChallengeDomainIF extends Document {
  title: string;
  description: string;
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
  functionSignature?: string;
  initialCode?: string | { [language: string]: string };
  solutionCode?: string | { [language: string]: string };
  status: "active" | "inactive" | "draft" | "archived";
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  xpRewards: number;
  createdAt: Date;
}
