import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { Document } from "mongoose";

export type ChallengeLevel = "novice" | "adept" | "master";
export type ChallengeType = "code" | "cipher";

export interface TestCaseIF {
  input: unknown[];
  output: unknown;
  isHidden: boolean;
}

export interface ChallengeAttrs {
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


export interface ChallengeDocument extends ChallengeAttrs, Document { }

export interface CreateChallengeInput {
  title: string;
  instructions: string;
  type: "code" | "cipher";
  level: "novice" | "adept" | "master";
  testCases: TestCaseIF[];
  timeLimit: number;
  tags: string[];
  xpRewards: number;
  hints?: string[];
  requiredSkills?: string[];
  functionName?: string;
  parameters?: { name: string; type: string }[];
  returnType?: string;
  initialCode?: string | Record<string, string>;
  solutionCode?: string | Record<string, string>;
  isPremium?: boolean;
  isKeyRequired?: boolean;
  status?: "active" | "inactive" | "draft" | "archived";
  startTime?: Date;
  endTime?: Date;
}

export interface UpdateChallengePayload {
  title: string;
  instructions: string;
  type: "code" | "cipher";
  level: "novice" | "adept" | "master";
  testCases: TestCaseIF[];
  timeLimit: number;
  tags: string[];
  xpRewards: number;
  hints?: string[];
  requiredSkills?: string[];
  functionName?: string;
  parameters?: { name: string; type: string }[];
  returnType?: string;
  initialCode?: string | Record<string, string>;
  solutionCode?: string | Record<string, string>;
  isPremium?: boolean;
  isKeyRequired?: boolean;
  status?: "active" | "inactive" | "draft" | "archived";
  startTime?: Date;
  endTime?: Date;
}

export interface ChallengeDBQuery {
  type?: "code" | "cipher";
  isPremium?: boolean;
  level?: "novice" | "adept" | "master";
  tags?: { $in: string[] };
  title?: { $regex: string; $options: string };
}


export interface ChallengeQueryFilter {
  type?: "code" | "cipher";
  level?: "novice" | "adept" | "master";
  isPremium?: boolean;
  tags?: string[];
  searchQuery?: string;
  limit?: number;
  page?: number;
}

export interface UserHomeChallengeDTO extends PublicChallengeDTO {
  userStatus: string;
  completedUsers: number;
  successRate: number;
}

