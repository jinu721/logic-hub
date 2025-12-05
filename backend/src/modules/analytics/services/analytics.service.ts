import {
  IAnalyticsService,
  IAnalyticsRepository,
  ILeaderboardRepository,
} from "@modules/analytics";
import { UserAnalytics, ChallengeStats } from "@shared/types";
import { toPublicUserDTO } from "@modules/user";

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private analyticsRepo: IAnalyticsRepository,
    private leaderboardRepository: ILeaderboardRepository
  ) {}

  async fetchUserAnalytics(): Promise<UserAnalytics> {
    return this.analyticsRepo.getUserAnalytics();
  }

  async fetchChallengeStats(): Promise<ChallengeStats> {
    return this.analyticsRepo.getChallengeStats();
  }

  async getLeaderboardData(
    based: string,
    category: string,
    period: string,
    order: string,
    page: number,
    limit: number
  ): Promise<any> {
    const sortFieldMap: Record<string, string> = {
      txp: "totalXp",
      score: "totalScore",
      fastest: "avgTimeTaken",
      memory: "avgMemoryUsed",
      cpu: "avgCpuTime",
      attempts: "submissionsCount",
    };

    const sortField = sortFieldMap[based] || "totalXp";
    const sortOrder = order === "asc" ? 1 : -1;

    let fromDate: Date | null = null;
    if (period !== "all") {
      const now = new Date();
      fromDate = new Date(now);

      if (period === "day") fromDate.setDate(now.getDate() - 1);
      else if (period === "week") fromDate.setDate(now.getDate() - 7);
      else if (period === "month") fromDate.setMonth(now.getMonth() - 1);
      else if (period === "year") fromDate.setFullYear(now.getFullYear() - 1);
    }

    const matchConditions: any = { passed: true };
    if (fromDate) matchConditions.submittedAt = { $gte: fromDate };
    if (category && category !== "all") matchConditions.level = category;


    const rawData = await this.leaderboardRepository.getLeaderboardData(
      matchConditions,
      sortField,
      sortOrder,
      page,
      limit
    );

    const totalItems = await this.leaderboardRepository.coutAllLeaderboardData(
      matchConditions
    );

    const statistics = await this.leaderboardRepository.getStatistics();


    const users = rawData.map((item: any, index: number) => ({
      rank: (page - 1) * limit + index + 1,
      user: toPublicUserDTO(item.user),
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
  }
}
