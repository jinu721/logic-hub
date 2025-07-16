import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "../../types/analytics.types";

export interface IAdminAnalyticsRepository {
  getUserAnalytics(): Promise<UserAnalytics>;
  getChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardTrends(): Promise<LeaderboardTrends>;
}
