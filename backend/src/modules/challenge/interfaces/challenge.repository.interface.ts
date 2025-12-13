import { Types } from "mongoose";
import { ChallengeDocument } from "@modules/challenge"; 
import { CreateChallengeInput, ChallengeDBQuery } from "@shared/types";

export interface IChallengeRepository {
  createChallenge(challengeData: CreateChallengeInput): Promise<ChallengeDocument>;
  getChallengeById(id: Types.ObjectId): Promise<ChallengeDocument | null>;
  getChallenges(query: ChallengeDBQuery,skip:number,limit: number): Promise<ChallengeDocument[]>;
  getAllChallenges(search:string,skip:number,limit: number): Promise<ChallengeDocument[]>;
  countAllChallenges(search:string): Promise<number>;
  updateChallenge(id: Types.ObjectId, updateData: Partial<ChallengeDocument>): Promise<ChallengeDocument | null>;
  deleteChallenge(id: Types.ObjectId): Promise<boolean>;
}
