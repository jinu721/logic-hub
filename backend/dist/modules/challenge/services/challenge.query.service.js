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
exports.ChallengeQueryService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
class ChallengeQueryService extends _core_1.BaseService {
    constructor(_challengeRepo, _submissionRepo) {
        super();
        this._challengeRepo = _challengeRepo;
        this._submissionRepo = _submissionRepo;
    }
    toDTO(challenge) {
        return (0, dtos_1.toPublicChallengeDTO)(challenge);
    }
    toDTOs(challenges) {
        return (0, dtos_1.toPublicChallengeDTOs)(challenges);
    }
    findChallengeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this._challengeRepo.getChallengeById((0, application_1.toObjectId)(id));
            return this.mapOne(challenge);
        });
    }
    getChallengeById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this._challengeRepo.getChallengeById((0, application_1.toObjectId)(id));
            if (!challenge)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            const challengeDTO = this.mapOne(challenge);
            if (userId) {
                const [history, recent] = yield Promise.all([
                    this._submissionRepo.getSubmissionsByUserAndChallenge((0, application_1.toObjectId)(userId), (0, application_1.toObjectId)(id)),
                    this._submissionRepo.getLatestSubmissionByUserAndChallenge((0, application_1.toObjectId)(userId), (0, application_1.toObjectId)(id))
                ]);
                challengeDTO.submisionHistory = (0, dtos_1.toPublicSubmissionDTOs)(history);
                challengeDTO.recentSubmission = recent ? (0, dtos_1.toPublicSubmissionDTO)(recent) : undefined;
            }
            return Object.assign(Object.assign({}, challengeDTO), { userId });
        });
    }
    getChallenges(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const limit = filter.limit || 10;
            const page = filter.page || 1;
            const skip = (page - 1) * limit || 0;
            const query = {};
            if (filter.type)
                query.type = filter.type;
            if (filter.isPremium)
                query.isPremium = filter.isPremium;
            if (filter.level)
                query.level = filter.level;
            if (filter.tags)
                query.tags = { $in: filter.tags };
            if (filter.searchQuery)
                query.title = { $regex: filter.searchQuery, $options: "i" };
            const challenges = yield this._challengeRepo.getChallenges(query, skip, limit);
            const totalItems = yield this._challengeRepo.countAllChallenges("");
            return {
                challenges: this.mapMany(challenges),
                totalItems
            };
        });
    }
    getAllChallenges(search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const challenges = yield this._challengeRepo.getAllChallenges(search, skip, limit);
            const totalItems = yield this._challengeRepo.countAllChallenges(search);
            return {
                challenges: this.mapMany(challenges),
                totalItems
            };
        });
    }
    getUserHomeChallenges(filter, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (filter.type) {
                query.type = filter.type;
            }
            if (filter.isPremium) {
                query.isPremium = filter.isPremium;
            }
            if (filter.level) {
                query.level = filter.level;
            }
            if (filter.tags) {
                query.tags = { $in: filter.tags };
            }
            if (filter.searchQuery) {
                query.title = { $regex: filter.searchQuery, $options: "i" };
            }
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const popularChallangeId = yield this._submissionRepo.getMostCompletedChallengeOfWeek(oneWeekAgo);
            let popularChallange = null;
            if (popularChallangeId) {
                popularChallange = yield this._challengeRepo.getChallengeById(popularChallangeId);
            }
            if (!userId)
                return {
                    challenges: [],
                    popularChallange: popularChallange ? this.mapOne(popularChallange) : null,
                };
            const challenges = yield this._challengeRepo.getChallenges(query, 0, 20);
            const submissionList = yield this._submissionRepo.getAllSubmissions();
            const userSubmissionList = yield this._submissionRepo.getAllSubmissionsByUser((0, application_1.toObjectId)(userId));
            const userSubmissionMap = new Map();
            userSubmissionList.forEach((p) => userSubmissionMap.set(p.challengeId.toString(), p));
            const challengeSubmissionMap = new Map();
            if (submissionList && submissionList.length !== 0) {
                for (const p of submissionList) {
                    const id = p.challengeId._id.toString();
                    if (!challengeSubmissionMap.has(id)) {
                        challengeSubmissionMap.set(id, { total: 0, completed: 0 });
                    }
                    const stats = challengeSubmissionMap.get(id);
                    stats.total += 1;
                    if (p.status === "completed")
                        stats.completed += 1;
                }
            }
            const challengesData = challenges.map((challenge) => {
                const challengeId = challenge._id ? challenge._id.toString() : "";
                const progress = userSubmissionMap.get(challengeId);
                if (!progress)
                    return challenge;
                let userStatus = "not attempted";
                if (progress)
                    userStatus = progress.status;
                const stats = challengeSubmissionMap.get(challengeId);
                const totalAttempts = (stats === null || stats === void 0 ? void 0 : stats.total) || 0;
                const completedUsers = (stats === null || stats === void 0 ? void 0 : stats.completed) || 0;
                const successRate = totalAttempts > 0
                    ? Math.round((completedUsers / totalAttempts) * 100)
                    : 0;
                return Object.assign(Object.assign({}, (0, dtos_1.toPublicChallengeDTO)(challenge)), { userStatus,
                    completedUsers,
                    successRate });
            });
            if (popularChallange) {
                const popId = popularChallange._id ? popularChallange._id.toString() : "";
                const progress = userSubmissionMap.get(popId);
                let userStatus = "not attempted";
                if (progress)
                    userStatus = progress.status;
                const stats = challengeSubmissionMap.get(popId);
                const totalAttempts = (stats === null || stats === void 0 ? void 0 : stats.total) || 0;
                const completedUsers = (stats === null || stats === void 0 ? void 0 : stats.completed) || 0;
                const successRate = totalAttempts > 0
                    ? Math.round((completedUsers / totalAttempts) * 100)
                    : 0;
                popularChallange = Object.assign(Object.assign({}, popularChallange.toObject()), { userStatus,
                    completedUsers,
                    successRate });
            }
            return {
                challenges: challengesData,
                popularChallange: popularChallange,
            };
        });
    }
}
exports.ChallengeQueryService = ChallengeQueryService;
