import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeQueryFilter } from "@shared/types";

export interface IChallengeQueryService {
  findChallengeById(id: string): Promise<PublicChallengeDTO | null>;
  getChallengeById(id: string, userId?: string): Promise<PublicChallengeDTO & { userId?: string }>;
  getAllChallenges(search: string, page: number, limit: number): Promise<{
    challenges: PublicChallengeDTO[];
    totalItems: number;
  }>;
  getUserHomeChallenges(filter: ChallengeQueryFilter, userId: string): Promise<{
    challenges: PublicChallengeDTO[];
    popularChallange: PublicChallengeDTO | null;
  }>;
}
