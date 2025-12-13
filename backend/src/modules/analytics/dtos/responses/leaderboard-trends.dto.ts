import { LeaderboardMeta, LeaderboardStatisticsDomain } from "@shared/types";
import { LeaderboardUserDTO } from "./leaderboard-user.dto";

export interface LeaderboardTrendsDTO {
  users: LeaderboardUserDTO[];
  meta: LeaderboardMeta;
  statistics: LeaderboardStatisticsDomain;
}
