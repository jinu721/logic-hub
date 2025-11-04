import { Types } from "mongoose";
import { SubmissionIF } from "../../types/submission.types";

export interface ISubmissionRepository {
  createSubmission(data: SubmissionIF): Promise<SubmissionIF>;
  getSubmissionByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionIF[]>;
  getSubmissionById(id: Types.ObjectId): Promise<SubmissionIF | null>;
  updateSubmission(id: Types.ObjectId, data: Partial<SubmissionIF>): Promise<SubmissionIF | null>;
  getLatestSubmissionByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionIF | null>;
  getAllSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionIF[]>;
  getSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionIF[] | null>;
  deleteSubmissionById(id: Types.ObjectId): Promise<boolean>;
  getRecentSubmissions(userId: Types.ObjectId): Promise<SubmissionIF[] | null>;
  getAllSubmissionsByUser(userId: Types.ObjectId): Promise<SubmissionIF[]>;
  findCompletedDomainsByUser(userId: Types.ObjectId): Promise<number>;
  getMostCompletedChallengeOfWeek(oneWeekAgo: Date): Promise<Types.ObjectId | null>;
  getAllSubmissionsByChallenge(challengeId: Types.ObjectId): Promise<SubmissionIF[]>;
  getAllSubmissions(): Promise<SubmissionIF[] | null>;
  getSubmissionsByUserAndYear(userId: Types.ObjectId, year: number): Promise<SubmissionIF[] | null>;
}
