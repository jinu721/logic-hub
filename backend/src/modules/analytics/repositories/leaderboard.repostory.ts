import { SubmissionModel } from "@modules/challenge";
import { ILeaderboardRepository } from "@modules/analytics";
import { LeaderboardDbSortKey, LeaderboardFilters, LeaderboardStatisticsDomain, LeaderboardUserDomain, SortDirection, TopCompletedChallenge } from "@shared/types";

export class LeaderboardRepository implements ILeaderboardRepository {
  async getLeaderboardData(
    matchConditions: LeaderboardFilters,
    sortField: LeaderboardDbSortKey,
    sortOrder: SortDirection,
    page: number,
    limit: number
  ): Promise<LeaderboardUserDomain[]> {
    const leaderboard = await SubmissionModel.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$userId",
          avgTimeTaken: { $avg: "$timeTaken" },
          totalXp: { $sum: "$xpGained" },
          totalScore: { $sum: "$score" },
          submissionsCount: { $sum: 1 },
          avgMemoryUsed: { $avg: "$execution.memoryUsed" },
          avgCpuTime: { $avg: "$execution.cpuTime" },
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
          totalScore: 1,
          submissionsCount: 1,
          avgMemoryUsed: 1,
          avgCpuTime: 1,
        },
      },
      { $sort: { [sortField]: sortOrder, _id: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return leaderboard;
  }

  async coutAllLeaderboardData(matchConditions: LeaderboardFilters): Promise<number> {
    return await SubmissionModel.countDocuments(matchConditions);
  }

  async getStatistics(): Promise<LeaderboardStatisticsDomain> {
    const totalSubmissions = await SubmissionModel.countDocuments();
    const totalUsers = await SubmissionModel.distinct("userId").then(
      (res) => res.length
    );
    const passedSubmissions = await SubmissionModel.countDocuments({
      passed: true,
    });

    const successRate =
      totalSubmissions === 0
        ? 0
        : Math.round((passedSubmissions / totalSubmissions) * 100);

    const topChallenges = await SubmissionModel.aggregate([
      { $match: { passed: true } },
      {
        $group: {
          _id: "$challengeId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
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
          name: "$challenge.title",
          count: 1,
        },
      },
    ]);

    return {
      totalSubmissions,
      totalUsers,
      completionRate: successRate,
      successRate,
      topCompletedChallenges: topChallenges.map((c: { name: string; count: number }): TopCompletedChallenge => ({
        name: c.name,
        completions: c.count,
      })),
    };
  }
}
