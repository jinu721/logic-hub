import { TestCaseIF } from "./challenge.types";

export interface UserAnalyticsDomain {
  totalUsers: number;
  activeUsersToday: number;
  newUsersLast7Days: number;
}

export interface MostPlayedChallengeDomain {
  title: string;
  count: number;
}

export interface ChallengeCompletionRateDomain {
  title: string;
  rate: number;
}

export interface ChallengeAverageTimeDomain {
  title: string;
  avgTime: number;
}

export interface ChallengeAttemptsSuccessDomain {
  title: string;
  attempts: number;
  successes: number;
}

export interface ChallengeStatsDomain {
  mostPlayedRooms: MostPlayedChallengeDomain[];
  completionRates: ChallengeCompletionRateDomain[];
  averageCompletionTime: ChallengeAverageTimeDomain[];
  attemptsVsSuccess: ChallengeAttemptsSuccessDomain[];
}


export interface LeaderboardTopUserDomain {
  username: string;
  stats: { xpPoints: number };
}

export interface XpDistributionBucketDomain {
  _id: string | number;
  count: number;
}

export interface BadgesUnlockedDomain {
  badgeName: string;
  count: number;
}

export interface ChallengeInput {
    title: string,
    instructions: string,
    type: "code" | "cipher",
    level: "novice" | "adept" | "master",
    timeLimit: number,
    tags: string[],
    requiredSkills: string[],
    functionName: string,
    parameters: string[],
    returnType: string,
    isPremium: boolean,
    isKeyRequired: boolean,
    initialCode: string,
    solutionCode: string,
    isActive: boolean,
    testCases: TestCaseIF[],
    hints: string[],
    status: "active" | "inactive",
    xpRewards: number,
    startTime: Date | null,
    endTime: Date | null,
}