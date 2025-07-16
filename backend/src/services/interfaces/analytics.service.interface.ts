import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "../../types/analytics.types"

export interface IAdminAnalyticsService {
  fetchUserAnalytics(): Promise<UserAnalytics>;
  fetchChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardData(based: string,category: string, period: string, order: string, page: number, limit: number): Promise<LeaderboardTrends>;
}
