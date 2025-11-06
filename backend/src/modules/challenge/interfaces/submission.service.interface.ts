import { PublicSubmissionDTO } from "@modules/challenge/dtos";
import { SubmissionIF } from "@shared/types";

export interface ISubmissionService {
  createSubmission(data: SubmissionIF): Promise<PublicSubmissionDTO>;
  getSubmissionsByUserAndChallenge(data: { userId: string; challengeId: string }): Promise<PublicSubmissionDTO[]>;
  getRecentSubmissions(username: string): Promise<PublicSubmissionDTO[] | null>;
  getSubmissionById(id: string): Promise<PublicSubmissionDTO | null>;
  updateSubmission(id: string, data: Partial<SubmissionIF>): Promise<PublicSubmissionDTO | null>;
  deleteSubmissionById(id: string): Promise<boolean>;
  getAllSubmissionsByUser(userId: string): Promise<PublicSubmissionDTO[]>;
  getAllSubmissionsByChallenge(challengeId: string): Promise<PublicSubmissionDTO[]>;
  getAllSubmissions(): Promise<PublicSubmissionDTO[] | null>;
  getUserHeatmapData(userId: string, year: number): Promise<{ [date: string]: number }>;
}
