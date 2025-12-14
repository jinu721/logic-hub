export interface TestCaseIF {
  input: any[];
  output: any;
  expectedOutput?: any;
  actualOutput?: any;
  isHidden?: boolean;
  passed?: boolean;
}

export interface SubmissionIF {
  challengeId?: string;
  execution?: {
    language?: string;
    codeSubmitted?: string;
    resultOutput?: any;
    testCasePassed?: number;
    totalTestCases?: number;
  };
  level?: number;
  passed?: boolean;
  status?: string;
  submittedAt?: Date;
  tags?: string[];
  timeTaken?: number;
  type: "code" | "cipher";
  userId: string;
  xpPoints?: number;
};


export interface ChallengeDomainIF {
  _id?: string | undefined;
  title: string;
  description?: string;
  instructions: string;
  type: "code" | "cipher";
  level: "novice" | "adept" | "master";
  testCases?: TestCaseIF[];
  timeLimit: number;
  recentSubmission?: SubmissionIF;
  submisionHistory?: SubmissionIF[];
  tags: string[];
  hints: string[];
  requiredSkills: string[];
  isPremium: boolean;
  isKeyRequired: boolean;
  userStatus?: "completed" | "failed-timeout" | "failed-output" | "pending"
  completedUsers?: number;
  successRate?: number;
  functionName?: string;
  parameters?: { name: string; type: string }[];
  returnType?: string;
  initialCode?: any;
  solutionCode?: any;
  status: "active" | "inactive" | "draft" | "archived";
  isActive: boolean;
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  xpRewards: number;
}