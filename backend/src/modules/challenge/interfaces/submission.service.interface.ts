import { PublicSubmissionDTO } from "@modules/challenge/dtos";
import { SubmissionAttrs } from "@shared/types";

export interface ISubmissionService {
  createSubmission(data: SubmissionAttrs): Promise<PublicSubmissionDTO>;
  getSubmissionsByUserAndChallenge(data: { userId: string; challengeId: string }): Promise<PublicSubmissionDTO[]>;
  getRecentSubmissions(username: string): Promise<PublicSubmissionDTO[] | null>;
  getSubmissionById(id: string): Promise<PublicSubmissionDTO | null>;
  updateSubmission(id: string, data: Partial<SubmissionAttrs>): Promise<PublicSubmissionDTO | null>;
  deleteSubmissionById(id: string): Promise<boolean>;
  getAllSubmissionsByUser(userId: string): Promise<PublicSubmissionDTO[]>;
  getAllSubmissionsByChallenge(challengeId: string): Promise<PublicSubmissionDTO[]>;
  getAllSubmissions(): Promise<PublicSubmissionDTO[] | null>;
  getUserHeatmapData(userId: string, year: number): Promise<{ [date: string]: number }>;
}
