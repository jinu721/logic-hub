import {
  CreateSolutionInput,
  SolutionWithUser,
  SolutionWithFullComments,
  SolutionWithChallenge,
  SolutionQuery,
  SolutionSortOption
} from "@shared/types";

import { SolutionDocument } from "@modules/challenge";

export interface ISolutionRepository {
  createSolution(data: CreateSolutionInput): Promise<SolutionWithUser>;

  findSolutionsByChallenge(
    query: SolutionQuery,
    sort: SolutionSortOption,
    page: number,
    limit: number
  ): Promise<SolutionWithFullComments[]>;

  findSolutionsByUser(userId: string): Promise<SolutionWithChallenge[]>;

  likeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null>;

  checkUserLikedSolution(solutionId: string, userId: string): Promise<boolean>;

  unlikeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null>;

  commentSolution(
    solutionId: string,
    comment: { user: string; content: string }
  ): Promise<SolutionWithUser | null>;

  deleteComment(solutionId: string, commentId: string): Promise<SolutionDocument | null>;

  updateSolution(
    solutionId: string,
    data: Partial<SolutionDocument>
  ): Promise<SolutionWithUser | null>;

  deleteSolution(solutionId: string): Promise<boolean>;
}
