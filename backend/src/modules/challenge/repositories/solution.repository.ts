import { BaseRepository } from "@shared/core";
import {
  SolutionQuery,
  SolutionSortOption,
  CreateSolutionInput,
  PopulatedSolution,
  SolutionDocument
} from "@shared/types";
import { ISolutionRepository, SolutionModel } from "@modules/challenge";

export class SolutionRepository extends BaseRepository<SolutionDocument>
  implements ISolutionRepository {
  constructor() {
    super(SolutionModel);
  }

  async getSolutionById(solutionId: string): Promise<PopulatedSolution | null> {
    return this.model
      .findById(solutionId)
      .populate("user")
      .populate("challenge")
      .populate("comments.user") as unknown as PopulatedSolution;
  }

  async createSolution(data: CreateSolutionInput): Promise<SolutionDocument> {
    return this.model.create(data);
  }

  async findSolutionsByChallenge(
    query: SolutionQuery,
    sort: SolutionSortOption,
    page: number,
    limit: number
  ): Promise<PopulatedSolution[]> {
    return this.model
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .populate("challenge")
      .populate("comments.user") as unknown as PopulatedSolution[];
  }

  async findSolutionsByUser(userId: string): Promise<PopulatedSolution[]> {
    return this.model
      .find({ user: userId })
      .populate("user")
      .populate("challenge")
      .populate("comments.user") as unknown as PopulatedSolution[];
  }

  async likeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null> {
    return this.model.findByIdAndUpdate(
      solutionId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async checkUserLikedSolution(solutionId: string, userId: string): Promise<boolean> {
    const result = await this.model.findOne({ _id: solutionId, likes: userId });
    return !!result;
  }

  async unlikeSolution(solutionId: string, userId: string): Promise<SolutionDocument | null> {
    return this.model.findByIdAndUpdate(
      solutionId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  async commentSolution(
    solutionId: string,
    comment: { user: string; content: string }
  ): Promise<SolutionDocument | null> {
    return this.model
      .findByIdAndUpdate(
        solutionId,
        {
          $push: {
            comments: {
              user: comment.user,
              content: comment.content,
            },
          },
        },
        { new: true }
      );
  }

  async deleteComment(solutionId: string, commentId: string): Promise<SolutionDocument | null> {
    return this.model.findByIdAndUpdate(
      solutionId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
  }

  async updateSolution(
    solutionId: string,
    data: Partial<SolutionDocument>
  ): Promise<SolutionDocument | null> {
    return this.model
      .findByIdAndUpdate(solutionId, data, { new: true });
  }

  async deleteSolution(solutionId: string): Promise<boolean> {
    const success = await this.model.findByIdAndDelete(solutionId);
    return !!success;
  }
}
