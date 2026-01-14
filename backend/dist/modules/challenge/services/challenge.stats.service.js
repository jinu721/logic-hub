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
exports.ChallengeStatsService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
class ChallengeStatsService extends _core_1.BaseService {
    constructor(challengeRepo, submissionRepo, userRepo, levelRepo) {
        super();
        this.challengeRepo = challengeRepo;
        this.submissionRepo = submissionRepo;
        this.userRepo = userRepo;
        this.levelRepo = levelRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicChallengeDTO)(entity);
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicChallengeDTOs)(entities);
    }
    applySubmissionEffects(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { challengeId, passed } = data;
            const challenge = yield this.challengeRepo.getChallengeById((0, application_1.toObjectId)(challengeId));
            if (!challenge)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            const user = yield this.userRepo.getUserById(userId);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const existing = yield this.submissionRepo.getSubmissions({
                userId: user._id,
                challengeId: (0, application_1.toObjectId)(challengeId),
                passed: true,
                submittedAt: { $gte: startOfWeek }
            });
            const alreadyCompletedThisWeek = existing.length > 1;
            let xpGained = 0;
            let newXP = user.stats.xpPoints;
            let newLevel = user.stats.level;
            if (passed && !alreadyCompletedThisWeek) {
                xpGained = challenge.xpRewards;
                newXP += xpGained;
                while (true) {
                    const nextLevel = yield this.levelRepo.getLevelByLevel(newLevel + 1);
                    if (!nextLevel || newXP < nextLevel.requiredXP)
                        break;
                    newXP -= nextLevel.requiredXP;
                    newLevel = nextLevel.levelNumber;
                }
                user.stats.xpPoints = newXP;
                user.stats.totalXpPoints += xpGained;
                user.stats.level = newLevel;
                const updateData = {
                    $set: {
                        "stats.xpPoints": newXP,
                        "stats.level": newLevel,
                    },
                    $inc: {
                        "stats.totalXpPoints": xpGained,
                    },
                };
                yield this.userRepo.updateUser(user._id, updateData);
            }
            return {
                passed,
                xpGained,
                newLevel: newLevel > user.stats.level ? newLevel : undefined,
            };
        });
    }
    getPopularChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return this.submissionRepo.getMostCompletedChallengeOfWeek(oneWeekAgo);
        });
    }
    getChallengeSuccessRate(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.submissionRepo.getAllSubmissionsByChallenge((0, application_1.toObjectId)(challengeId));
            const total = list.length;
            const completed = list.filter((x) => x.status === "completed").length;
            return total > 0 ? Math.round((completed / total) * 100) : 0;
        });
    }
}
exports.ChallengeStatsService = ChallengeStatsService;
