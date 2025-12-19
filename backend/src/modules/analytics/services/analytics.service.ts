import {
  IAnalyticsService,
  IAnalyticsRepository,
  ILeaderboardRepository,
} from "@modules/analytics";
import { LeaderboardSortField, LeaderboardPeriod, SortOrder, LeaderboardDbSortKey } from "@shared/types";
import { ChallengeStatsDTO, LeaderboardTrendsDTO, LeaderboardUserDTO, UserAnalyticsDTO } from "@modules/analytics/dtos";
import { toPublicUserDTO } from "@modules/user";

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private analyticsRepo: IAnalyticsRepository,
    private leaderboardRepository: ILeaderboardRepository
  ) { }

  async fetchUserAnalytics(): Promise<UserAnalyticsDTO> {
    return this.analyticsRepo.getUserAnalytics();
  }

  async fetchChallengeStats(): Promise<ChallengeStatsDTO> {
    return this.analyticsRepo.getChallengeStats();
  }

  async getLeaderboardData(
    based: LeaderboardSortField,
    category: string,
    period: LeaderboardPeriod,
    order: SortOrder,
    page: number,
    limit: number
  ): Promise<LeaderboardTrendsDTO> {
    try {
      const sortFieldMap: Record<LeaderboardSortField, LeaderboardDbSortKey> = {
        txp: "totalXp",
        score: "totalScore",
        fastest: "avgTimeTaken",
        memory: "avgMemoryUsed",
        cpu: "avgCpuTime",
        attempts: "submissionsCount",
      };

      const sortField = sortFieldMap[based];
      const sortOrder = order === "asc" ? 1 : -1;

      let fromDate: Date | null = null;
      if (period !== "all") {
        fromDate = new Date();
        if (period === "day") fromDate.setDate(fromDate.getDate() - 1);
        if (period === "week") fromDate.setDate(fromDate.getDate() - 7);
        if (period === "month") fromDate.setMonth(fromDate.getMonth() - 1);
        if (period === "year") fromDate.setFullYear(fromDate.getFullYear() - 1);
      }

      const matchConditions: Record<string, unknown> = { passed: true };
      if (fromDate) matchConditions.submittedAt = { $gte: fromDate };
      if (category !== "all") matchConditions.level = category;

      console.log("🔍 Leaderboard Query:", { based, category, period, order, page, limit });
      console.log("🔍 Match Conditions:", matchConditions);

      const rawData = await this.leaderboardRepository.getLeaderboardData(
        matchConditions,
        sortField,
        sortOrder,
        page,
        limit
      );

      const totalItems =
        await this.leaderboardRepository.coutAllLeaderboardData(matchConditions);

      const statistics = await this.leaderboardRepository.getStatistics();

      const users: LeaderboardUserDTO[] = rawData.map((item, index) => ({
        rank: (page - 1) * limit + index + 1,
        user: item.user,
        avgTimeTaken: item.avgTimeTaken ?? 0,
        avgMemoryUsed: item.avgMemoryUsed ?? 0,
        avgCpuTime: item.avgCpuTime ?? 0,
        totalXp: item.totalXp ?? 0,
        totalScore: item.totalScore ?? 0,
        submissionsCount: item.submissionsCount ?? 0,
      }));

      const totalPages = Math.max(1, Math.ceil(totalItems / limit));

      return {
        users,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          sortBy: based,
          sortField,
          order,
          period,
          category,
        },
        statistics,
      };
    } catch (error) {
      console.error("❌ Leaderboard Service Error:", error);
      throw error;
    }
  }

}
