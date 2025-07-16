import { PublicChallengeProgressDTO } from "../../mappers/progress.dto";
import { ChallengeProgressIF } from "../../types/progress.types";

export interface IChallengeProgressService {
  createProgress(data: ChallengeProgressIF): Promise<PublicChallengeProgressDTO>;
  getProgressByUserAndChallenge(data: { userId: string; challengeId: string }): Promise<PublicChallengeProgressDTO[]>;
  getProgressById(id: string): Promise<PublicChallengeProgressDTO | null>;
  updateProgress(id: string, data: Partial<ChallengeProgressIF>): Promise<PublicChallengeProgressDTO | null>;
  deleteProgressById(id: string): Promise<boolean>;
  getAllProgressByUser(userId: string): Promise<PublicChallengeProgressDTO[]>;
  getAllProgressByChallenge(challengeId: string): Promise<PublicChallengeProgressDTO[]>;
  getAllProgress(): Promise<PublicChallengeProgressDTO[] | null>;
  getUserHeatmapData(userId: string, year: number): Promise<{ [date: string]: number }>;
}
