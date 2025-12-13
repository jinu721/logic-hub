import { SubmissionEffectsData, SubmissionEffectsResult } from "@shared/types";
import { Types } from "mongoose";

export interface IChallengeStatsService {
  applySubmissionEffects(data: SubmissionEffectsData, userId: string): Promise<SubmissionEffectsResult>;
  getPopularChallenge(): Promise<Types.ObjectId | null>;
  getChallengeSuccessRate(challengeId: string): Promise<number>;
}
