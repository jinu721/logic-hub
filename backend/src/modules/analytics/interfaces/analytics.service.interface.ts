import { LeaderboardSortField, LeaderboardPeriod, SortOrder } from "@shared/types"
import { ChallengeStatsDTO, LeaderboardTrendsDTO, UserAnalyticsDTO } from "@modules/analytics/dtos";

export interface IAnalyticsService {
  fetchUserAnalytics(): Promise<UserAnalyticsDTO>;
  fetchChallengeStats(): Promise<ChallengeStatsDTO>;
  getLeaderboardData(
    based: LeaderboardSortField,
    category: string,
    period: LeaderboardPeriod,
    order: SortOrder,
    page: number,
    limit: number
  ): Promise<LeaderboardTrendsDTO>;
}

