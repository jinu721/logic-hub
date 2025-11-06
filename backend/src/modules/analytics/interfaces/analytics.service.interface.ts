import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "@shared/types"

export interface IAnalyticsService {
  fetchUserAnalytics(): Promise<UserAnalytics>;
  fetchChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardData(based: string,category: string, period: string, order: string, page: number, limit: number): Promise<LeaderboardTrends>;
}
