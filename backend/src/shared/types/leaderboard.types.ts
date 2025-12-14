import { Types } from "mongoose";
import { SortOrder } from "./core.types";

export interface LeaderboardUserDomain {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    username: string;
    stats: { xpPoints: number };
    avatar?: {
      _id: Types.ObjectId;
      imageUrl: string;
    } | null;
  };

  avgTimeTaken: number;
  avgMemoryUsed: number;
  avgCpuTime: number;
  totalXp: number;
  totalScore: number;
  submissionsCount: number;
}

export interface LeaderboardTrendsDomain {
  topUsers: {
    username: string;
    stats: {
      xpPoints: number;
    };
  }[];
  xpDistribution: {
    _id: number | string;
    count: number;
  }[];
  badgesUnlocked: {
    badgeName: string;
    count: number;
  }[];
}

export interface TopCompletedChallengeDomain {
  name: string;
  completions: number;
}

export interface LeaderboardStatisticsDomain {
  totalSubmissions: number;
  totalUsers: number;
  successRate: number;
  completionRate: number;
  topCompletedChallenges: TopCompletedChallengeDomain[];
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



export interface LeaderboardFilters {
  passed?: boolean;
  submittedAt?: { $gte: Date };
  level?: string;
}

export type LeaderboardSortField =
  | "txp"
  | "score"
  | "fastest"
  | "memory"
  | "cpu"
  | "attempts";


export interface TopCompletedChallenge {
  name: string;
  completions: number;
}

export type LeaderboardDbSortKey = "totalXp" | "totalScore" | "avgTimeTaken" | "avgMemoryUsed" | "avgCpuTime" | "submissionsCount";



export type LeaderboardPeriod = "day" | "week" | "month" | "year" | "all";


export interface LeaderboardMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  sortBy: LeaderboardSortField;
  sortField: LeaderboardDbSortKey;
  order: SortOrder;
  period: LeaderboardPeriod;
  category: string;
}


export interface LeaderboardUser {
  _id: Types.ObjectId;
  username: string;
  avatar?: {
    _id: Types.ObjectId;
    imageUrl: string;
  } | null;
};
