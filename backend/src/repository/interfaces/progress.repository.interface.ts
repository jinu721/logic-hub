import { Types } from "mongoose";
import { ChallengeProgressIF } from "../../types/progress.types"; 

export interface IChallengeProgressRepository {
  createProgress(data: ChallengeProgressIF): Promise<ChallengeProgressIF>;
  getProgressByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<ChallengeProgressIF[]>;
  getProgressById(id: Types.ObjectId): Promise<ChallengeProgressIF | null>;
  updateProgress(id: Types.ObjectId, data: Partial<ChallengeProgressIF>): Promise<ChallengeProgressIF | null>;
  getLatestSubmissionByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<ChallengeProgressIF | null>;
  getAllSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<ChallengeProgressIF[]>;
  deleteProgressById(id: Types.ObjectId): Promise<boolean>;
  getAllProgressByUser(userId: Types.ObjectId): Promise<ChallengeProgressIF[]>;
  findCompletedDomainsByUser(userId: Types.ObjectId): Promise<number>;
  getMostCompletedChallengeOfWeek(oneWeekAgo: Date): Promise<Types.ObjectId | null>;
  getAllProgressByChallenge(challengeId: Types.ObjectId): Promise<ChallengeProgressIF[]>;
  getAllProgress(): Promise<ChallengeProgressIF[] | null>;
  getSubmissionsByUserAndYear(userId: Types.ObjectId, year: number): Promise<ChallengeProgressIF[] | null>;
}
