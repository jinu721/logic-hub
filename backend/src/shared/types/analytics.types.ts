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

  