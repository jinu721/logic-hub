"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const user_1 = require("../../user");
const challenge_1 = require("../../challenge");
class AnalyticsRepository {
    getUserAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUsers = yield user_1.UserModel.countDocuments();
            const activeUsersToday = yield user_1.UserModel.countDocuments({
                lastSeen: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            });
            const newUsersLast7Days = yield user_1.UserModel.countDocuments({
                timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            });
            return { totalUsers, activeUsersToday, newUsersLast7Days };
        });
    }
    getChallengeStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const mostPlayedRooms = yield challenge_1.SubmissionModel.aggregate([
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
            const completionRates = yield challenge_1.SubmissionModel.aggregate([
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
            const averageCompletionTime = yield challenge_1.SubmissionModel.aggregate([
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
            const attemptsVsSuccess = yield challenge_1.SubmissionModel.aggregate([
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
        });
    }
    getLeaderboardTrends() {
        return __awaiter(this, void 0, void 0, function* () {
            const topUsers = yield user_1.UserModel.find()
                .sort({ "stats.xpPoints": -1 })
                .limit(10)
                .select("username stats.xpPoints")
                .lean();
            const xpDistribution = yield user_1.UserModel.aggregate([
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
            const badgesUnlocked = yield user_1.UserModel.aggregate([
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
        });
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
