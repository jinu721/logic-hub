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
exports.AnalyticsService = void 0;
class AnalyticsService {
    constructor(analyticsRepo, leaderboardRepository) {
        this.analyticsRepo = analyticsRepo;
        this.leaderboardRepository = leaderboardRepository;
    }
    fetchUserAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.analyticsRepo.getUserAnalytics();
        });
    }
    fetchChallengeStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.analyticsRepo.getChallengeStats();
        });
    }
    getLeaderboardData(based, category, period, order, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sortFieldMap = {
                    txp: "totalXp",
                    score: "totalScore",
                    fastest: "avgTimeTaken",
                    memory: "avgMemoryUsed",
                    cpu: "avgCpuTime",
                    attempts: "submissionsCount",
                };
                const sortField = sortFieldMap[based];
                const sortOrder = order === "asc" ? 1 : -1;
                let fromDate = null;
                if (period !== "all") {
                    fromDate = new Date();
                    if (period === "day")
                        fromDate.setDate(fromDate.getDate() - 1);
                    if (period === "week")
                        fromDate.setDate(fromDate.getDate() - 7);
                    if (period === "month")
                        fromDate.setMonth(fromDate.getMonth() - 1);
                    if (period === "year")
                        fromDate.setFullYear(fromDate.getFullYear() - 1);
                }
                const matchConditions = { passed: true };
                if (fromDate)
                    matchConditions.submittedAt = { $gte: fromDate };
                if (category !== "all")
                    matchConditions.level = category;
                console.log("🔍 Leaderboard Query:", { based, category, period, order, page, limit });
                console.log("🔍 Match Conditions:", matchConditions);
                const rawData = yield this.leaderboardRepository.getLeaderboardData(matchConditions, sortField, sortOrder, page, limit);
                const totalItems = yield this.leaderboardRepository.coutAllLeaderboardData(matchConditions);
                const statistics = yield this.leaderboardRepository.getStatistics();
                const users = rawData.map((item, index) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        rank: (page - 1) * limit + index + 1,
                        user: item.user,
                        avgTimeTaken: (_a = item.avgTimeTaken) !== null && _a !== void 0 ? _a : 0,
                        avgMemoryUsed: (_b = item.avgMemoryUsed) !== null && _b !== void 0 ? _b : 0,
                        avgCpuTime: (_c = item.avgCpuTime) !== null && _c !== void 0 ? _c : 0,
                        totalXp: (_d = item.totalXp) !== null && _d !== void 0 ? _d : 0,
                        totalScore: (_e = item.totalScore) !== null && _e !== void 0 ? _e : 0,
                        submissionsCount: (_f = item.submissionsCount) !== null && _f !== void 0 ? _f : 0,
                    });
                });
                const totalPages = Math.max(1, Math.ceil(totalItems / limit));
                return {
                    users,
                    meta: {
                        page,
                        limit,
                        totalItems,
                        totalPages,
                        sortBy: based,
                        sortField,
                        order,
                        period,
                        category,
                    },
                    statistics,
                };
            }
            catch (error) {
                console.error("❌ Leaderboard Service Error:", error);
                throw error;
            }
        });
    }
}
exports.AnalyticsService = AnalyticsService;
