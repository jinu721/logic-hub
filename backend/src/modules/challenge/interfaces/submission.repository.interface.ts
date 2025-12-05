import { Types } from "mongoose";
import { SubmissionAttrs } from "@shared/types"; 
import { SubmissionDocument } from "@modules/challenge";

export interface ISubmissionRepository {
  createSubmission(data: SubmissionAttrs): Promise<SubmissionDocument>;
  getSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionDocument[]>;
  getSubmissionById(id: Types.ObjectId): Promise<SubmissionDocument | null>;
  updateSubmission(id: Types.ObjectId, data: Partial<SubmissionAttrs>): Promise<SubmissionDocument | null>;
  getLatestSubmissionByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionDocument | null>;
  getAllSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionDocument[]>;
  getRecentSubmissions(userId: Types.ObjectId): Promise<SubmissionDocument[] | null>;
  deleteSubmissionById(id: Types.ObjectId): Promise<boolean>;
  getAllSubmissionsByUser(userId: Types.ObjectId): Promise<SubmissionDocument[]>;
  findCompletedDomainsByUser(userId: Types.ObjectId): Promise<number>;
  getMostCompletedChallengeOfWeek(oneWeekAgo: Date): Promise<Types.ObjectId | null>;
  getAllSubmissionsByChallenge(challengeId: Types.ObjectId): Promise<SubmissionDocument[]>;
  getAllSubmissions(): Promise<SubmissionDocument[] | null>;
  getSubmissionsByUserAndYear(userId: Types.ObjectId, year: number): Promise<SubmissionDocument[] | null>;
}
