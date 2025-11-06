import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "@shared/types";

export interface IAnalyticsRepository {
  getUserAnalytics(): Promise<UserAnalytics>;
  getChallengeStats(): Promise<ChallengeStats>;
  getLeaderboardTrends(): Promise<LeaderboardTrends>;
}
