import { SolutionIF } from "@shared/types";

export interface ISolutionRepository {
  createSolution(data: Partial<SolutionIF>): Promise<SolutionIF>;
  findSolutionsByChallenge(query: any, sort: any, page: number, limit: number): Promise<SolutionIF[]>;
  findSolutionsByUser(userId: string): Promise<SolutionIF[]>;
  likeSolution(solutionId: string, userId: string): Promise<SolutionIF | null>;
  checkUserLikedSolution(solutionId: string, userId: string): Promise<boolean>;
  unlikeSolution(solutionId: string, userId: string): Promise<SolutionIF | null>;
  commentSolution(solutionId: string, comment: { user: string; content: string }): Promise<SolutionIF | null>;
  deleteComment(solutionId: string, commentId: string): Promise<SolutionIF | null>;
  updateSolution(solutionId: string, data: Partial<SolutionIF>): Promise<SolutionIF | null>;
  deleteSolution(solutionId: string): Promise<boolean>;
}
