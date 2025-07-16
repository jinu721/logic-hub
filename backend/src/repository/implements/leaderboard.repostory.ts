import { ChallengeProgress } from "../../models/progress.model";
import { ILeaderboardRepository } from "../interfaces/leaderboard.repostory.interface";

export class LeaderboardRepository implements ILeaderboardRepository {
  async getLeaderboardData(
    matchConditions: any,
    sortField: any,
    sortOrder: any,
    page: number,
    limit: number
  ): Promise<any> {
    const leaderboard = await ChallengeProgress.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$userId",
          avgTimeTaken: { $avg: "$timeTaken" },
          totalXp: { $sum: "$xpGained" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "avatars",
          localField: "user.avatar",
          foreignField: "_id",
          as: "user.avatar",
        },
      },
      {
        $unwind: {
          path: "$user.avatar",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          user: 1,
          avgTimeTaken: 1,
          totalXp: 1,
          count: 1,
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return leaderboard;
  }
  async coutAllLeaderboardData(matchConditions: any): Promise<any> {
    return await ChallengeProgress.countDocuments(matchConditions);
  }

  async getStatistics(): Promise<any> {
    const totalSubmissions = await ChallengeProgress.countDocuments(); 
    const totalUsers = await ChallengeProgress.distinct("userId").then(
      (res) => res.length
    );
    const passedSubmissions = await ChallengeProgress.countDocuments({
      passed: true,
    });

    const successRate =
      totalSubmissions === 0
        ? 0
        : Math.round((passedSubmissions / totalSubmissions) * 100);

    const topChallenges = await ChallengeProgress.aggregate([
      { $match: { passed: true } },
      {
        $group: {
          _id: "$challengeId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      { $limit: 3 },
      {
        $lookup: {
          from: "challenges",
          localField: "_id",
          foreignField: "_id",
          as: "challenge",
        },
      },
      { $unwind: "$challenge" },
      {
        $project: {
          name: "$challenge.name",
          count: 1,
        },
      },
    ]);

    return {
      totalSubmissions,
      totalUsers,
      completionRate: successRate,
      successRate,
      topCompletedChallenges: topChallenges.map((c) => ({
        name: c.name,
        completions: c.count,
      })),
    };
  }
}
