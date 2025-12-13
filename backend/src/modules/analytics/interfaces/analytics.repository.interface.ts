import { UserAnalyticsDomain, ChallengeStatsDomain, LeaderboardTrendsDomain } from "@shared/types";

export interface IAnalyticsRepository {
  getUserAnalytics(): Promise<UserAnalyticsDomain>;
  getChallengeStats(): Promise<ChallengeStatsDomain>;
  getLeaderboardTrends(): Promise<LeaderboardTrendsDomain>;
}
