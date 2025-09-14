import { IAdminAnalyticsService } from "../interfaces/analytics.service.interface";
import { IAdminAnalyticsRepository } from "../../repository/interfaces/analytics.repository.interface";
import {
  UserAnalytics,
  ChallengeStats,
} from "../../types/analytics.types";
import { LeaderboardRepository } from "../../repository/implements/leaderboard.repostory";
import { toPublicUserDTO } from "../../mappers/user.dto";

export class AdminAnalyticsService implements IAdminAnalyticsService {
  constructor(
    private analyticsRepo: IAdminAnalyticsRepository,
    private leaderboardRepository: LeaderboardRepository
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
      txp: "stats.totalXpPoints",
      fastest: "avgTimeTaken",
      streak: "stats.currentStreak",
      level: "stats.level",
      rank: "stats.level",
    };

    const sortField = sortFieldMap[based] || "stats.totalXpPoints";
    const sortOrder = order === "asc" ? 1 : -1;

    const now = new Date();
    let fromDate = new Date();
    if (period === "day") fromDate.setDate(now.getDate() - 1);
    if (period === "week") fromDate.setDate(now.getDate() - 7);
    else if (period === "month") fromDate.setMonth(now.getMonth() - 1);
    else if (period === "year") fromDate.setFullYear(now.getFullYear() - 1);

    const matchConditions: any = {
      submittedAt: { $gte: fromDate },
      passed: true,
    };
    if (category && category !== "all") {
      matchConditions.level = category;
    }
    const rawData = await this.leaderboardRepository.getLeaderboardData(
      matchConditions,
      sortField,
      sortOrder,
      page,
      limit
    );

    const users = rawData.map((item: any) => ({
      ...toPublicUserDTO(item.user),
      avgTimeTaken: item.avgTimeTaken,
      totalXp: item.totalXp,
      count: item.count,
    }));

    const totalItems = await this.leaderboardRepository.coutAllLeaderboardData(
      matchConditions
    );
    const statistics =  await this.leaderboardRepository.getStatistics()
    console.log("Statistics: ", statistics);
    return {users,totalItems,statistics};
  }
}
