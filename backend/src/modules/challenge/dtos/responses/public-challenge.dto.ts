import { TestCaseIF } from "@shared/types";

export interface PublicChallengeDTO {
  _id: string;
  title: string;
  instructions: string;
  type: "code" | "cipher";
  level: "novice" | "adept" | "master";
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
  createdAt?: Date;
}

