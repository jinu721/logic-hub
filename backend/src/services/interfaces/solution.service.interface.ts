import { SolutionIF } from "../../shared/types/solutions.types";
import { PublicSolutionDTO } from "../../mappers/solution.dto";

export interface ISolutionService {
  addSolution(data: Partial<SolutionIF>): Promise<PublicSolutionDTO>;
  getSolutionsByChallenge(challengeId: string, search: string, page: number, limit: number, sortBy: string): Promise<PublicSolutionDTO[]>;
  getSolutionsByUser(userId: string): Promise<PublicSolutionDTO[]>;
  like(solutionId: string, userId: string): Promise<PublicSolutionDTO | null>;
  comment(userId: string, data: { solutionId: string; content: string }): Promise<PublicSolutionDTO | null>;
  deleteComment(solutionId: string, commentId: string): Promise<PublicSolutionDTO | null>;
  update(solutionId: string, data: Partial<SolutionIF>): Promise<PublicSolutionDTO | null>;
  delete(solutionId: string): Promise<void>;
}
