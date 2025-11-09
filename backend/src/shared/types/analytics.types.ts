export interface UserAnalytics {
    totalUsers: number;
    activeUsersToday: number;
    newUsersLast7Days: number;
  }
  
  export interface ChallengeStats {
    mostPlayedRooms: { title: string; count: number }[];
    completionRates: { title: string; rate: number }[];
    averageCompletionTime: { title: string; avgTime: number }[];
    attemptsVsSuccess: { title: string; attempts: number; successes: number }[];
  }
  
  export interface LeaderboardTrends {
    topUsers: any[];
    xpDistribution: { range: string; count: number }[];
    badgesUnlocked: { date: string; count: number }[];
  }
  