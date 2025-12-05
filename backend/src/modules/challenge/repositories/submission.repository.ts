import { Types } from "mongoose";
import { SubmissionModel, ISubmissionRepository, SubmissionDocument } from "@modules/challenge";
import { BaseRepository } from "@core";
import { SubmissionAttrs } from "@shared/types";

export class SubmissionRepository
  extends BaseRepository<SubmissionDocument>
  implements ISubmissionRepository
{
  constructor() {
    super(SubmissionModel);
  }

  async createSubmission(
    data: SubmissionAttrs
  ): Promise<SubmissionDocument> {
    const submission = new this.model(data);
    return await submission.save();
  }

  async getSubmissionsByUserAndChallenge(
    userId: Types.ObjectId,
    challengeId: Types.ObjectId
  ): Promise<SubmissionDocument[]> {
    return await this.model.find({
      userId: userId,
      challengeId: challengeId,
    });
  }

  async findCompletedDomainsByUser(userId: Types.ObjectId): Promise<number> {
    const uniqueCompleted = await this.model.distinct("challengeId", {
      userId,
      passed: true,
    });
    return uniqueCompleted.length;
  }

  async getSubmissionById(
    id: Types.ObjectId
  ): Promise<SubmissionDocument | null> {
    return await this.model.findById(id);
  }

  async getSubmissions(filter: any): Promise<SubmissionDocument[]> {
    return await this.model.find(filter);
  }

  async updateSubmission(
    id: Types.ObjectId,
    data: Partial<SubmissionAttrs>
  ): Promise<SubmissionDocument | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSubmissionById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllSubmissionsByUser(
    userId: Types.ObjectId
  ): Promise<SubmissionDocument[]> {
    const allSubmissions  = await this.model.find({ userId });

    const latestSubmissionMap = new Map<string, SubmissionAttrs>();

    allSubmissions.forEach((submission) => {
      const existingSubmission = latestSubmissionMap.get(
        submission.challengeId.toString()
      );
      if (
        !existingSubmission ||
        submission.submittedAt > existingSubmission.submittedAt
      ) {
        latestSubmissionMap.set(submission.challengeId.toString(), submission);
      }
    });

    return Array.from(latestSubmissionMap.values());
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

  async getRecentSubmissions(
    userId: Types.ObjectId
  ): Promise<SubmissionDocument[] | null> {
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

  async getAllSubmissions(): Promise<SubmissionIF[]> {
    return await this.model
      .find()
      .populate({
        path: "userId",
        populate: [{ path: "avatar" }, { path: "banner" }],
      })
      .populate("challengeId");
  }

  async getAllSubmissionsByChallenge(
    challengeId: Types.ObjectId
  ): Promise<SubmissionDocument[]> {
    return await this.model.find({ challengeId });
  }
  async getSubmissionsByUserAndYear(userId: Types.ObjectId, year: number) {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);
    return await this.model.find({
      userId,
      submittedAt: { $gte: start, $lte: end },
    });
  }
}
