import {
  LeaderboardDbSortKey,
  LeaderboardFilters,
  LeaderboardStatisticsDomain,
  LeaderboardUserDomain,
  SortDirection,
} from "@shared/types";

export interface ILeaderboardRepository {
  getLeaderboardData(
    matchConditions: LeaderboardFilters,
    sortField: LeaderboardDbSortKey,
    sortOrder: SortDirection,
    page: number,
    limit: number
  ): Promise<LeaderboardUserDomain[]>;

  coutAllLeaderboardData(matchConditions: LeaderboardFilters): Promise<number>;

  getStatistics(): Promise<LeaderboardStatisticsDomain>;
}
