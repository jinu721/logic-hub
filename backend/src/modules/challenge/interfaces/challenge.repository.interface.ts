import { Types } from "mongoose";
import { ChallengeIF } from "@shared/types"; 

export interface IChallengeRepository {
  createChallenge(challengeData: Omit<ChallengeIF, '_id'>): Promise<ChallengeIF>;
  getChallengeById(id: Types.ObjectId): Promise<ChallengeIF | null>;
  getChallenges(query: object,skip:number,limit: number): Promise<ChallengeIF[]>;
  getAllChallenges(search:string,skip:number,limit: number): Promise<ChallengeIF[]>;
  countAllChallenges(search:string): Promise<number>;
  updateChallenge(id: Types.ObjectId, updateData: Partial<ChallengeIF>): Promise<ChallengeIF | null>;
  deleteChallenge(id: Types.ObjectId): Promise<boolean>;
}
