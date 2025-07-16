import { ChallengeProgress } from "../../models/progress.model";
import { BaseRepository } from "../base.repository";
import { IChallengeProgressRepository } from "../interfaces/progress.repository.interface";
import { ChallengeProgressIF } from "../../types/progress.types";

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

  async getProgressByUserAndChallenge(data: {
    userId: string;
    challengeId: string;
  }): Promise<ChallengeProgressIF[]> {
    return await this.model.find({
      userId: data.userId,
      challengeId: data.challengeId,
    });
  }

  async findCompletedDomainsByUser(userId: string): Promise<number> {
    console.log("userId", userId);
    const uniqueCompleted = await this.model.distinct("challengeId", {
      userId,
      passed: true,
    });
    return uniqueCompleted.length;
  }

  async getProgressById(id: string): Promise<ChallengeProgressIF | null> {
    return await this.model.findById(id);
  }

  async getProgress(filter: any): Promise<ChallengeProgressIF[]> {
    return await this.model.find(filter);
  }

  async updateProgress(
    id: string,
    data: Partial<ChallengeProgressIF>
  ): Promise<ChallengeProgressIF | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProgressById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllProgressByUser(userId: string): Promise<ChallengeProgressIF[]> {
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
    userId: string,
    challengeId: string
  ) {
    return this.model.findOne({ userId, challengeId }).sort({ createdAt: -1 });
  }

  async getAllSubmissionsByUserAndChallenge(
    userId: string,
    challengeId: string
  ) {
    return this.model.find({ userId, challengeId }).sort({ createdAt: -1 });
  }

  async getRecentProgress(
    userId: string
  ): Promise<ChallengeProgressIF[] | null> {
    return await this.model.find({ userId }).sort({ submittedAt: -1 }).limit(3);
  }

  async getMostCompletedChallengeOfWeek(
    oneWeekAgo: Date
  ): Promise<string | null> {
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
    challengeId: string
  ): Promise<ChallengeProgressIF[]> {
    return await this.model.find({ challengeId });
  }
  async getSubmissionsByUserAndYear(username: string, year: number) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    return ChallengeProgress.find({
      username,
      submittedAt: { $gte: start, $lte: end },
    });
  }
}
