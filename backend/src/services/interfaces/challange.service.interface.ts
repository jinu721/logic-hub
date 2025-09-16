import { PublicChallengeDTO } from "../../mappers/challenge.dto";
import { ChallengeDomainIF } from "../../types/challenge.types"; 
import { Types } from "mongoose";


export interface SubmitPayload {
  challengeId: string;
  userCode?: string;
  token:string;
  language:string,
  timeTakenSeconds: number,
  timeTakenReadable: string
  selectedOptions?: any;
  isTimeLimitedSubmission?: boolean;
  finishTime: number;
  dragData?: any;
};

export interface IChallengeService {
  createChallenge(challengeData: Omit<ChallengeDomainIF, "_id">): Promise<PublicChallengeDTO>;
  getChallengeById(id: string, userId?: string): Promise<PublicChallengeDTO | null>;
  getChallenges(filter: any,userId?: string): Promise<{challenges:PublicChallengeDTO[],popularChallange:PublicChallengeDTO | null,totalItems:number}>;
  getAllChallenges(search:string,page:number,limit:number): Promise<{challenges:PublicChallengeDTO[],totalItems:number}>;
  updateChallenge(id: string, updateData: Partial<PublicChallengeDTO>): Promise<PublicChallengeDTO | null>;
  deleteChallenge(id: string): Promise<boolean>;
  getChallengesByStatus(status: "active" | "inactive" | "draft" | "archived"): Promise<PublicChallengeDTO[]>;
  getChallengesByTags(tags: string[]): Promise<PublicChallengeDTO[]>;
  getChallengesByDifficulty(difficulty: "novice" | "adept" | "master"): Promise<PublicChallengeDTO[]>;
  runChallengeCode(challengeId: string, language: string, sourceCode: string, input: string,userId: string): Promise<string>;
  submitChallenge(data:SubmitPayload,userId: string): Promise<any>;
}
