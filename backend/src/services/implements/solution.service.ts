import { ISolutionService } from "../interfaces/solution.service.interface";
import { SolutionIF } from "../../types/solutions.types";
import { SolutionRepository } from "../../repository/implements/solution.repository";
import { PublicSolutionDTO, toPublicSolutionDTO, toPublicSolutionDTOs } from "../../mappers/solution.dto";

export class SolutionService implements ISolutionService {
  constructor(private repo: SolutionRepository) {}

  async addSolution(data: Partial<SolutionIF>): Promise<PublicSolutionDTO> {
    const newSolution = await this.repo.create(data);

    return  toPublicSolutionDTO(newSolution);
  }

async getSolutionsByChallenge(
  challengeId: string,
  search: string,
  page: number,
  limit: number,
  sortBy: string
): Promise<PublicSolutionDTO[]> {
  const query: any = { challenge: challengeId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption: any = {};
  if (sortBy === "likes") sortOption = { likes: -1 };
  else if (sortBy === "newest") sortOption = { createdAt: -1 };
  else if (sortBy === "comments") sortOption = { commentsCount: -1 };

  const solutions = await this.repo.findByChallenge(query, sortOption, page, limit);
  return toPublicSolutionDTOs(solutions);
}


  async getSolutionsByUser(userId: string): Promise<PublicSolutionDTO[]> {
    const solution = await this.repo.findByUser(userId);
    console.log("Solution : ", solution);
    return toPublicSolutionDTOs(solution);
  }

  async like(solutionId: string, userId: string): Promise<PublicSolutionDTO | null> {
    const isLiked = await this.repo.checkUserLikedSolution(solutionId, userId);
    if (isLiked) {
      const unliked = await this.repo.unlikeSolution(solutionId, userId);
      return toPublicSolutionDTO(unliked as SolutionIF);
    }
    const liked = await this.repo.likeSolution(solutionId, userId);
    return toPublicSolutionDTO(liked as SolutionIF);
  }

  async comment(
    userId: string,
    data: { solutionId: string; content: string }
  ): Promise<PublicSolutionDTO | null> {
    const { solutionId, content } = data;
    const commented = await this.repo.commentSolution(solutionId, {
      user: userId,
      content,
    });
    return toPublicSolutionDTO(commented as SolutionIF);
  }

  async deleteComment(solutionId: string, commentId: string): Promise<PublicSolutionDTO | null> {
    const deleted = await this.repo.deleteComment(solutionId, commentId);
    return toPublicSolutionDTO(deleted as SolutionIF);
  }

  async update(solutionId: string, data: Partial<SolutionIF>): Promise<PublicSolutionDTO | null> {
    const updated = await this.repo.updateSolution(solutionId, data);
    return toPublicSolutionDTO(updated as SolutionIF);
  }

  async delete(solutionId: string): Promise<void> {
    await this.repo.deleteSolution(solutionId);
  }
}
