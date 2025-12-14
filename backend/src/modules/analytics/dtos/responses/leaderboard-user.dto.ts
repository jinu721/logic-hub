import { LeaderboardUser } from "@shared/types";

export interface LeaderboardUserDTO {
  rank: number;
  user: LeaderboardUser;
  avgTimeTaken: number;
  avgMemoryUsed: number;
  avgCpuTime: number;
  totalXp: number;
  totalScore: number;
  submissionsCount: number;
}

