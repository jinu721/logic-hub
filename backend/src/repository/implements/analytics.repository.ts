import { IAdminAnalyticsRepository } from "../interfaces/analytics.repository.interface";
import { UserAnalytics, ChallengeStats, LeaderboardTrends } from "../../types/analytics.types";
import User from "../../models/user.model";
import { ChallengeProgress } from "../../models/progress.model";
import { ChallengeDomain } from "../../models/challange.model";

export class AdminAnalyticsRepository implements IAdminAnalyticsRepository {
  async getUserAnalytics(): Promise<UserAnalytics> {
    const totalUsers = await User.countDocuments();
    const activeUsersToday = await User.countDocuments({
      lastSeen: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const newUsersLast7Days = await User.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    return { totalUsers, activeUsersToday, newUsersLast7Days };
  }

  async getChallengeStats(): Promise<ChallengeStats> {
    const mostPlayedRooms = await ChallengeProgress.aggregate([
      {
        $group: {
          _id: "$challengeId",
          count: { $sum: 1 },
        },
      },
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
          title: "$challenge.title",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const completionRates = await ChallengeProgress.aggregate([
      {
        $group: {
          _id: "$challengeId",
          total: { $sum: 1 },
          passed: { $sum: { $cond: ["$passed", 1, 0] } },
        },
      },
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
          title: "$challenge.title",
          rate: { $multiply: [{ $divide: ["$passed", "$total"] }, 100] },
        },
      },
    ]);

    const averageCompletionTime = await ChallengeProgress.aggregate([
      {
        $match: { passed: true },
      },
      {
        $group: {
          _id: "$challengeId",
          avgTime: { $avg: "$timeTaken" },
        },
      },
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
          title: "$challenge.title",
          avgTime: 1,
        },
      },
    ]);

    const attemptsVsSuccess = await ChallengeProgress.aggregate([
      {
        $group: {
          _id: "$challengeId",
          attempts: { $sum: 1 },
          successes: { $sum: { $cond: ["$passed", 1, 0] } },
        },
      },
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
          title: "$challenge.title",
          attempts: 1,
          successes: 1,
        },
      },
    ]);

    return {
      mostPlayedRooms,
      completionRates,
      averageCompletionTime,
      attemptsVsSuccess,
    };
  }

  async getLeaderboardTrends(): Promise<LeaderboardTrends> {
    const topUsers = await User.find()
      .sort({ "stats.xpPoints": -1 })
      .limit(10)
      .select("username stats.xpPoints")
      .lean();

    const xpDistribution = await User.aggregate([
      {
        $bucket: {
          groupBy: "$stats.xpPoints",
          boundaries: [0, 100, 500, 1000, 5000, 10000],
          default: "10000+",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const badgesUnlocked = await User.aggregate([
      { $unwind: "$inventory.badges" },
      {
        $group: {
          _id: "$inventory.badges",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "badges",
          localField: "_id",
          foreignField: "_id",
          as: "badge",
        },
      },
      { $unwind: "$badge" },
      {
        $project: {
          badgeName: "$badge.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return { topUsers, xpDistribution, badgesUnlocked };
  }
}
