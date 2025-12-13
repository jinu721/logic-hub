import { BaseRepository } from "@shared/core";
import {
  SolutionQuery, 
  SolutionSortOption, 
  SolutionWithUser,
  SolutionWithFullComments,
  SolutionWithChallenge,
  CreateSolutionInput
} from "@shared/types";

import { SolutionDocument } from "@modules/challenge";

import { ISolutionRepository, SolutionModel } from "@modules/challenge";

export class SolutionRepository extends BaseRepository<SolutionDocument>
  implements ISolutionRepository {
  constructor() {
    super(SolutionModel);
  }

  async createSolution(data: CreateSolutionInput): Promise<SolutionWithUser> {
    const doc = await this.model.create(data);
    return (await doc.populate("user")) as SolutionWithUser;
  }

  async findSolutionsByChallenge(
    query: SolutionQuery,
    sort: SolutionSortOption,
    page: number,
    limit: number
  ): Promise<SolutionWithFullComments[]> {
    return this.model
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user")
      .populate("comments.user") as unknown as SolutionWithFullComments[];
  }

  async findSolutionsByUser(userId: string): Promise<SolutionWithChallenge[]> {
    return this.model
      .find({ user: userId })
      .populate("challenge")
      .populate("user") as unknown as SolutionWithChallenge[];
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
  ): Promise<SolutionWithUser | null> {
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
      )
      .populate("user") as unknown as SolutionWithUser;
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
  ): Promise<SolutionWithUser | null> {
    return this.model
      .findByIdAndUpdate(solutionId, data, { new: true })
      .populate("user") as unknown as SolutionWithUser;
  }

  async deleteSolution(solutionId: string): Promise<boolean> {
    const success = await this.model.findByIdAndDelete(solutionId);
    return !!success;
  }
}
