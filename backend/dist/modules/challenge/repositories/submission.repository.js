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
exports.SubmissionRepository = void 0;
const challenge_1 = require("../../challenge");
const _core_1 = require("../../../shared/core");
class SubmissionRepository extends _core_1.BaseRepository {
    constructor() {
        super(challenge_1.SubmissionModel);
    }
    createSubmission(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = new this.model(data);
            return yield submission.save();
        });
    }
    getSubmissionsByUserAndChallenge(userId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({
                userId: userId,
                challengeId: challengeId,
            });
        });
    }
    findCompletedDomainsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueCompleted = yield this.model.distinct("challengeId", {
                userId,
                passed: true,
            });
            return uniqueCompleted.length;
        });
    }
    getSubmissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    getSubmissions(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(filter);
        });
    }
    updateSubmission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, data, { new: true });
        });
    }
    deleteSubmissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id);
            return result !== null;
        });
    }
    getAllSubmissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allSubmissions = yield this.model.find({ userId });
            const latestSubmissionMap = new Map();
            allSubmissions.forEach((submission) => {
                const existingSubmission = latestSubmissionMap.get(submission.challengeId.toString());
                if (!existingSubmission ||
                    submission.submittedAt > existingSubmission.submittedAt) {
                    latestSubmissionMap.set(submission.challengeId.toString(), submission);
                }
            });
            return Array.from(latestSubmissionMap.values());
        });
    }
    getLatestSubmissionByUserAndChallenge(userId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ userId, challengeId }).sort({ createdAt: -1 });
        });
    }
    getAllSubmissionsByUserAndChallenge(userId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find({ userId, challengeId }).sort({ createdAt: -1 });
        });
    }
    getRecentSubmissions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ userId }).sort({ submittedAt: -1 }).limit(3);
        });
    }
    getMostCompletedChallengeOfWeek(oneWeekAgo) {
        return __awaiter(this, void 0, void 0, function* () {
            const aggResult = yield this.model.aggregate([
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
            if (!aggResult.length)
                return null;
            return aggResult[0]._id;
        });
    }
    getAllSubmissions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .find()
                .populate({
                path: "userId",
                populate: [{ path: "avatar" }, { path: "banner" }],
            })
                .populate("challengeId");
        });
    }
    getAllSubmissionsByChallenge(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ challengeId });
        });
    }
    getSubmissionsByUserAndYear(userId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31T23:59:59.999Z`);
            return yield this.model.find({
                userId,
                submittedAt: { $gte: start, $lte: end },
            });
        });
    }
}
exports.SubmissionRepository = SubmissionRepository;
