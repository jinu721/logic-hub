import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "../../shared/types/analytics.types";

export interface IAdminAnalyticsRepository {
  getUserAnalytics(): Promise<UserAnalytics>;
  getChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardTrends(): Promise<LeaderboardTrends>;
}
