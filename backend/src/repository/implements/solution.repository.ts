import { ISolutionRepository } from "../interfaces/solution.repository.interface";
import SolutionModel from "../../models/solution.model";
import { SolutionIF } from "../../shared/types/solutions.types";
import { BaseRepository } from "../../shared/core/base.repository";

export class SolutionRepository
  extends BaseRepository<SolutionIF>
  implements ISolutionRepository
{
  constructor() {
    super(SolutionModel);
  }
  async create(data: Partial<SolutionIF>) {
    const doc = await this.model.create(data);
    return await doc.populate("user");
  }

async findByChallenge(query: any, sort: any, page: number, limit: number) {
  return this.model
    .find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user")
    .populate("comments.user");
}

  async findByUser(userId: string) {
    return await this.model
      .find({ user: userId })
      .populate("challenge")
      .populate("user");
  }

  async likeSolution(solutionId: string, userId: string) {
    return await this.model.findByIdAndUpdate(
      solutionId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async checkUserLikedSolution(solutionId: string, userId: string) {
    const result = await this.model.findOne({ _id: solutionId, likes: userId });
    return result ? true : false;
  }

  async unlikeSolution(solutionId: string, userId: string) {
    return await this.model.findByIdAndUpdate(
      solutionId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  async commentSolution(
    solutionId: string,
    comment: { user: string; content: string }
  ) {
    return await this.model.findByIdAndUpdate(
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
    ).populate("user");
  }

  async deleteComment(solutionId: string, commentId: string) {
    return await this.model.findByIdAndUpdate(
      solutionId,
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { new: true }
    );
  }

  async updateSolution(solutionId: string, data: Partial<SolutionIF>) {
    return await this.model.findByIdAndUpdate(solutionId, data, { new: true }).populate("user");
  }

  async deleteSolution(solutionId: string) {
    await this.model.findByIdAndDelete(solutionId);
  }
}
