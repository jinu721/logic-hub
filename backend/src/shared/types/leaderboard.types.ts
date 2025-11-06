export interface LeaderboardUser {
  id: number;
  rank: number;
  username: string;
  totalXP: number;
  level: number;
  solvedCount: number;
  submissions: number;
  domains: number;
  stats: any;
  hasUnlimitedAccess: boolean;
  avatar?: any;
}

export interface LevelDistribution {
  name: string;
  count: number;
  percentage: number;
}

export interface ChallengeTypeDistribution {
  name: string;
  count: number;
  percentage: number;
}

export interface DomainStat {
  name: string;
  completions: number;
  percentage: number;
}

export interface WeeklyActivityDay {
  name: string;
  value: number;
}

export interface WeeklyActivitySummary {
  busiestDay: string;
  avgSubmissions: number;
  growth: number;
  days: WeeklyActivityDay[];
}

export interface TopEarner {
  username: string;
  totalXP: number;
}

export interface DomainCompleter {
  username: string;
  domains: number;
}

export interface LongestStreakUser {
  _id: string;
  username: string;
  stats: {
    longestStreak: number;
  };
}

export interface TopPerformersSummary {
  topEarner?: TopEarner;
  domainCompleter?: DomainCompleter;
  longestStreakAgg?: LongestStreakUser;
}
