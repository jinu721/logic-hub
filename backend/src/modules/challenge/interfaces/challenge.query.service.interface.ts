import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeIF } from "@shared/types";

export interface IChallengeQueryService {
  findChallengeById(id: string): Promise<ChallengeIF | null>;
  getChallengeById(id: string, userId?: string): Promise<any>;
  getAllChallenges(search: string, page: number, limit: number): Promise<{
    challenges: PublicChallengeDTO[];
    totalItems: number;
  }>;
  getUserHomeChallenges(filter: any, userId: string): Promise<{
    challenges: PublicChallengeDTO[];
    popularChallange: PublicChallengeDTO | null;
  }>;
}
