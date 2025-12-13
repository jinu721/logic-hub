import { UserAnalytics, ChallengeStats, LeaderboardTrends, LeaderboardSortField, LeaderboardPeriod, SortOrder } from "@shared/types"

export interface IAnalyticsService {
  fetchUserAnalytics(): Promise<UserAnalytics>;
  fetchChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardData(
    based: LeaderboardSortField,
    category: string,
    period: LeaderboardPeriod,
    order: SortOrder,
    page: number,
    limit: number
  ): Promise<LeaderboardTrends>;
}

