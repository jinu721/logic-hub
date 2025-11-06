import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeIF } from "@shared/types";

export interface IChallengeQueryService {
  findChallengeById(id: string): Promise<ChallengeIF | null>;
  getChallengeById(id: string, userId?: string): Promise<any>;
  getChallenges(filter: any, userId: string): Promise<{
    challenges: PublicChallengeDTO[];
    popularChallange: PublicChallengeDTO | null;
    totalItems: number;
  }>;
  getAllChallenges(search: string, page: number, limit: number): Promise<{
    challenges: PublicChallengeDTO[];
    totalItems: number;
  }>;
  getChallengesByStatus(
    status: "active" | "inactive" | "draft" | "archived"
  ): Promise<PublicChallengeDTO[]>;
  getChallengesByTags(tags: string[]): Promise<PublicChallengeDTO[]>;
  getChallengesByDifficulty(
    difficulty: "novice" | "adept" | "master"
  ): Promise<PublicChallengeDTO[]>;
}
