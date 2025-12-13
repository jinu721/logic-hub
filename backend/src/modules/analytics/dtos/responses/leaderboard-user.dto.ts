import { PublicUserDTO } from "@modules/user";

export interface LeaderboardUserDTO {
  rank: number;
  user: PublicUserDTO;
  avgTimeTaken: number;
  avgMemoryUsed: number;
  avgCpuTime: number;
  totalXp: number;
  totalScore: number;
  submissionsCount: number;
}

