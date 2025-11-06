import { SolutionIF } from "@shared/types";
import { PublicSolutionDTO } from "@modules/challenge/dtos";

export interface ISolutionService {
  addSolution(data: Partial<SolutionIF>): Promise<PublicSolutionDTO>;
  getSolutionsByChallenge(challengeId: string, search: string, page: number, limit: number, sortBy: string): Promise<PublicSolutionDTO[]>;
  getSolutionsByUser(userId: string): Promise<PublicSolutionDTO[]>;
  likeSolution(solutionId: string, userId: string): Promise<PublicSolutionDTO | null>;
  commentSolution(userId: string, data: { solutionId: string; content: string }): Promise<PublicSolutionDTO | null>;
  deleteComment(solutionId: string, commentId: string): Promise<PublicSolutionDTO | null>;
  updateSolution(solutionId: string, data: Partial<SolutionIF>): Promise<PublicSolutionDTO | null>;
  deleteSolution(solutionId: string): Promise<boolean>;
}
