import { ChallengeProgress } from "../../models/progress.model";
import { BaseRepository } from "../base.repository";
import { IChallengeProgressRepository } from "../interfaces/progress.repository.interface";
import { ChallengeProgressIF } from "../../types/progress.types";
import { Types } from "mongoose";

export class ChallengeProgressRepository
  extends BaseRepository<ChallengeProgressIF>
  implements IChallengeProgressRepository
{
  constructor() {
    super(ChallengeProgress);
  }

  async createProgress(
    data: ChallengeProgressIF
  ): Promise<ChallengeProgressIF> {
    const progress = new this.model(data);
    return await progress.save();
  }

  async getProgressByUserAndChallenge(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId
  ): Promise<ChallengeProgressIF[]> {
    return await this.model.find({
      userId: userId,
      challengeId: challengeId,
    });
  }

  async findCompletedDomainsByUser(userId: Types.ObjectId): Promise<number> {
    console.log("userId", userId);
    const uniqueCompleted = await this.model.distinct("challengeId", {
      userId,
      passed: true,
    });
    return uniqueCompleted.length;
  }

  async getProgressById(
    id: Types.ObjectId
  ): Promise<ChallengeProgressIF | null> {
    return await this.model.findById(id);
  }

  async getProgress(filter: any): Promise<ChallengeProgressIF[]> {
    return await this.model.find(filter);
  }

  async updateProgress(
    id: Types.ObjectId,
    data: Partial<ChallengeProgressIF>
  ): Promise<ChallengeProgressIF | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProgressById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllProgressByUser(
    userId: Types.ObjectId
  ): Promise<ChallengeProgressIF[]> {
    const allProgress = await this.model.find({ userId });

    const latestProgressMap = new Map<string, ChallengeProgressIF>();

    allProgress.forEach((progress) => {
      const existingProgress = latestProgressMap.get(
        progress.challengeId.toString()
      );
      if (
        !existingProgress ||
        progress.submittedAt > existingProgress.submittedAt
      ) {
        latestProgressMap.set(progress.challengeId.toString(), progress);
      }
    });

    return Array.from(latestProgressMap.values());
  }

  async getLatestSubmissionByUserAndChallenge(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId
  ) {
    return this.model.findOne({ userId, challengeId }).sort({ createdAt: -1 });
  }

  async getAllSubmissionsByUserAndChallenge(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId
  ) {
    return this.model.find({ userId, challengeId }).sort({ createdAt: -1 });
  }

  async getRecentProgress(
    userId: Types.ObjectId
  ): Promise<ChallengeProgressIF[] | null> {
    return await this.model.find({ userId }).sort({ submittedAt: -1 }).limit(3);
  }

  async getMostCompletedChallengeOfWeek(
    oneWeekAgo: Date
  ): Promise<Types.ObjectId | null> {
    const aggResult = await this.model.aggregate([
      {
        $match: {
          passed: true,
          submittedAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: "$challengeId",
          completedCount: { $sum: 1 },
        },
      },
      {
        $sort: { completedCount: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    if (!aggResult.length) return null;

    return aggResult[0]._id;
  }

  async getAllProgress(): Promise<ChallengeProgressIF[]> {
    return await this.model
      .find()
      .populate({
        path: "userId",
        populate: [{ path: "avatar" }, { path: "banner" }],
      })
      .populate("challengeId");
  }

  async getAllProgressByChallenge(
    challengeId: Types.ObjectId
  ): Promise<ChallengeProgressIF[]> {
    return await this.model.find({ challengeId });
  }
  async getSubmissionsByUserAndYear(userId: Types.ObjectId, year: number) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    return ChallengeProgress.find({
      userId,
      submittedAt: { $gte: start, $lte: end },
    });
  }
}
