import {
  CreateSolutionInput,
  PopulatedSolution,
  SolutionQuery,
  SolutionSortOption,
  SolutionDocument
} from "@shared/types";


export interface ISolutionRepository {
  createSolution(data: CreateSolutionInput): Promise<SolutionDocument>;

  getSolutionById(solutionId: string): Promise<PopulatedSolution | null>;

  findSolutionsByChallenge(
    query: SolutionQuery,
    sort: SolutionSortOption,
    page: number,
    limit: number
  ): Promise<PopulatedSolution[]>;

  findSolutionsByUser(userId: string): Promise<PopulatedSolution[]>;

  likeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null>;

  checkUserLikedSolution(solutionId: string, userId: string): Promise<boolean>;

  unlikeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null>;

  commentSolution(
    solutionId: string,
    comment: { user: string; content: string }
  ): Promise<SolutionDocument | null>;

  deleteComment(solutionId: string, commentId: string): Promise<SolutionDocument | null>;

  updateSolution(
    solutionId: string,
    data: Partial<SolutionDocument>
  ): Promise<SolutionDocument | null>;

  deleteSolution(solutionId: string): Promise<boolean>;
}
