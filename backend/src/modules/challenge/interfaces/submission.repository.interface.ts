import { Types } from "mongoose";
import { CreateSubmissionInput, SubmissionDocument, UpdateSubmissionPayload } from "@shared/types"; 

export interface ISubmissionRepository {
  createSubmission(data: CreateSubmissionInput): Promise<SubmissionDocument>;
  getSubmissionsByUserAndChallenge(userId: Types.ObjectId, challengeId: Types.ObjectId): Promise<SubmissionDocument[]>;
  getSubmissionById(id: Types.ObjectId): Promise<SubmissionDocument | null>;
  updateSubmission(id: Types.ObjectId, data: UpdateSubmissionPayload): Promise<SubmissionDocument | null>;
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
