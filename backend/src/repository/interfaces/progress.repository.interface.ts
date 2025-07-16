import { ChallengeProgressIF } from "../../types/progress.types"; 

export interface IChallengeProgressRepository {
  createProgress(data: ChallengeProgressIF): Promise<ChallengeProgressIF>;
  getProgressByUserAndChallenge(data: { userId: string; challengeId: string }): Promise<ChallengeProgressIF[]>;
  getProgressById(id: string): Promise<ChallengeProgressIF | null>;
  updateProgress(id: string, data: Partial<ChallengeProgressIF>): Promise<ChallengeProgressIF | null>;
  getLatestSubmissionByUserAndChallenge(userId: string, challengeId: string): Promise<ChallengeProgressIF | null>;
  getAllSubmissionsByUserAndChallenge(userId: string, challengeId: string): Promise<ChallengeProgressIF[]>;
  deleteProgressById(id: string): Promise<boolean>;
  getAllProgressByUser(userId: string): Promise<ChallengeProgressIF[]>;
  findCompletedDomainsByUser(userId: string): Promise<number>;
  getMostCompletedChallengeOfWeek(oneWeekAgo: Date): Promise<string | null>;
  getAllProgressByChallenge(challengeId: string): Promise<ChallengeProgressIF[]>;
  getAllProgress(): Promise<ChallengeProgressIF[] | null>;
  getSubmissionsByUserAndYear(userId: string, year: number): Promise<ChallengeProgressIF[] | null>;
}
