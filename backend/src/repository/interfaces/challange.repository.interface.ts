import { ChallengeDomainIF } from "../../types/challenge.types"; 
import { Types } from "mongoose";

export interface IChallengeRepository {
  createChallenge(challengeData: Omit<ChallengeDomainIF, '_id'>): Promise<ChallengeDomainIF>;
  getChallengeById(id: string): Promise<ChallengeDomainIF | null>;
  getChallenges(query: object,sort:object): Promise<ChallengeDomainIF[]>;
  getAllChallenges(search:string,skip:number,limit: number): Promise<ChallengeDomainIF[]>;
  countAllChallenges(search:string): Promise<number>;
  updateChallenge(id: Types.ObjectId, updateData: Partial<ChallengeDomainIF>): Promise<ChallengeDomainIF | null>;
  deleteChallenge(id: Types.ObjectId): Promise<boolean>;
  getChallengesByStatus(status: "active" | "inactive" | "draft" | "archived"): Promise<ChallengeDomainIF[]>;
  getChallengesByTags(tags: string[]): Promise<ChallengeDomainIF[]>;
  getChallengesByDifficulty(difficulty: "novice" | "adept" | "master"): Promise<ChallengeDomainIF[]>;
}
