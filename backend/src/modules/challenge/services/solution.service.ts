import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicSolutionDTO,
  toPublicSolutionDTO,
  toPublicSolutionDTOs
} from "@modules/challenge/dtos";
import {
  ISolutionService,
  ISolutionRepository
} from "@modules/challenge";
import { CreateSolutionInput, SolutionQuery, SolutionSortOption, PopulatedSolution, SolutionDocument, UpdateSolutionInput } from "@shared/types";

export class SolutionService
  extends BaseService<PopulatedSolution, PublicSolutionDTO>
  implements ISolutionService {
  constructor(
    private readonly solutionRepo: ISolutionRepository
  ) {
    super();
  }

  protected toDTO(solution: PopulatedSolution): PublicSolutionDTO {
    return toPublicSolutionDTO(solution);
  }

  protected toDTOs(solutions: PopulatedSolution[]): PublicSolutionDTO[] {
    return toPublicSolutionDTOs(solutions);
  }

  private async getPopulated(id: string): Promise<PopulatedSolution> {
    const solution = await this.solutionRepo.getSolutionById(id);
    if (!solution) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
    return solution;
  }

  async addSolution(data: CreateSolutionInput) {
    const created = await this.solutionRepo.createSolution(data);
    return this.mapOne(await this.getPopulated(String(created._id)));
  }

  async getSolutionsByChallenge(
    challengeId: string,
    search: string,
    page: number,
    limit: number,
    sortBy: string
  ) {
    const query: SolutionQuery = { challenge: challengeId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption: SolutionSortOption = {};
    if (sortBy === "likes") sortOption = { likes: -1 };
    else if (sortBy === "newest") sortOption = { createdAt: -1 };
    else if (sortBy === "comments") sortOption = { commentsCount: -1 };

    const solutions = await this.solutionRepo.findSolutionsByChallenge(query, sortOption, page, limit);
    return this.mapMany(solutions);
  }

  async getSolutionsByUser(userId: string) {
    const solutions = await this.solutionRepo.findSolutionsByUser(userId);
    return this.mapMany(solutions);
  }

  async likeSolution(solutionId: string, userId: string) {
    const isLiked = await this.solutionRepo.checkUserLikedSolution(solutionId, userId);

    if (isLiked) {
      const unliked = await this.solutionRepo.unlikeSolution(solutionId, userId);
      if (!unliked) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
      return this.mapOne(await this.getPopulated(solutionId));
    }

    const liked = await this.solutionRepo.likeSolution(solutionId, userId);
    if (!liked) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
    return this.mapOne(await this.getPopulated(solutionId));
  }

  async commentSolution(userId: string, data: { solutionId: string; content: string }) {
    const { solutionId, content } = data;
    const commented = await this.solutionRepo.commentSolution(solutionId, { user: userId, content });
    if (!commented) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
    return this.mapOne(await this.getPopulated(solutionId));
  }

  async deleteComment(solutionId: string, commentId: string) {
    const deleted = await this.solutionRepo.deleteComment(solutionId, commentId);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, "Comment not found");
    return this.mapOne(await this.getPopulated(solutionId));
  }

  async updateSolution(solutionId: string, data: UpdateSolutionInput) {
    const updated = await this.solutionRepo.updateSolution(solutionId, data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
    return this.mapOne(await this.getPopulated(solutionId));
  }

  async deleteSolution(solutionId: string) {
    const success = await this.solutionRepo.deleteSolution(solutionId);
    if (!success) throw new AppError(HttpStatus.NOT_FOUND, "Solution not found");
    return true;
  }
}
