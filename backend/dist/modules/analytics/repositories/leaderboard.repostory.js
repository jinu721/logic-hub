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
exports.LeaderboardRepository = void 0;
const challenge_1 = require("../../challenge");
class LeaderboardRepository {
    getLeaderboardData(matchConditions, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leaderboard = yield challenge_1.SubmissionModel.aggregate([
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
                    { $sort: Object.assign({}, { [sortField]: sortOrder }, { _id: 1 }) },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                ]);
                return leaderboard;
            }
            catch (error) {
                console.error("❌ Leaderboard Aggregation Error:", error);
                console.error("Match Conditions:", matchConditions);
                console.error("Sort Field:", sortField, "Sort Order:", sortOrder);
                throw error;
            }
        });
    }
    coutAllLeaderboardData(matchConditions) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield challenge_1.SubmissionModel.aggregate([
                { $match: matchConditions },
                { $group: { _id: "$userId" } },
                { $count: "total" }
            ]);
            return result.length > 0 ? result[0].total : 0;
        });
    }
    getStatistics() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalSubmissions = yield challenge_1.SubmissionModel.countDocuments();
            const totalUsers = yield challenge_1.SubmissionModel.distinct("userId").then((res) => res.length);
            const passedSubmissions = yield challenge_1.SubmissionModel.countDocuments({
                passed: true,
            });
            const successRate = totalSubmissions === 0
                ? 0
                : Math.round((passedSubmissions / totalSubmissions) * 100);
            const topChallenges = yield challenge_1.SubmissionModel.aggregate([
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
                topCompletedChallenges: topChallenges.map((c) => ({
                    name: c.name,
                    completions: c.count,
                })),
            };
        });
    }
}
exports.LeaderboardRepository = LeaderboardRepository;
