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
exports.SolutionService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
class SolutionService extends _core_1.BaseService {
    constructor(solutionRepo) {
        super();
        this.solutionRepo = solutionRepo;
    }
    toDTO(solution) {
        return (0, dtos_1.toPublicSolutionDTO)(solution);
    }
    toDTOs(solutions) {
        return (0, dtos_1.toPublicSolutionDTOs)(solutions);
    }
    getPopulated(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const solution = yield this.solutionRepo.getSolutionById(id);
            if (!solution)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
            return solution;
        });
    }
    addSolution(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.solutionRepo.createSolution(data);
            return this.mapOne(yield this.getPopulated(String(created._id)));
        });
    }
    getSolutionsByChallenge(challengeId, search, page, limit, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { challenge: challengeId };
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } }
                ];
            }
            let sortOption = {};
            if (sortBy === "likes")
                sortOption = { likes: -1 };
            else if (sortBy === "newest")
                sortOption = { createdAt: -1 };
            else if (sortBy === "comments")
                sortOption = { commentsCount: -1 };
            const solutions = yield this.solutionRepo.findSolutionsByChallenge(query, sortOption, page, limit);
            return this.mapMany(solutions);
        });
    }
    getSolutionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const solutions = yield this.solutionRepo.findSolutionsByUser(userId);
            return this.mapMany(solutions);
        });
    }
    likeSolution(solutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLiked = yield this.solutionRepo.checkUserLikedSolution(solutionId, userId);
            if (isLiked) {
                const unliked = yield this.solutionRepo.unlikeSolution(solutionId, userId);
                if (!unliked)
                    throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
                return this.mapOne(yield this.getPopulated(solutionId));
            }
            const liked = yield this.solutionRepo.likeSolution(solutionId, userId);
            if (!liked)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
            return this.mapOne(yield this.getPopulated(solutionId));
        });
    }
    commentSolution(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { solutionId, content } = data;
            const commented = yield this.solutionRepo.commentSolution(solutionId, { user: userId, content });
            if (!commented)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
            return this.mapOne(yield this.getPopulated(solutionId));
        });
    }
    deleteComment(solutionId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.solutionRepo.deleteComment(solutionId, commentId);
            if (!deleted)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Comment not found");
            return this.mapOne(yield this.getPopulated(solutionId));
        });
    }
    updateSolution(solutionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.solutionRepo.updateSolution(solutionId, data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
            return this.mapOne(yield this.getPopulated(solutionId));
        });
    }
    deleteSolution(solutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.solutionRepo.deleteSolution(solutionId);
            if (!success)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Solution not found");
            return true;
        });
    }
}
exports.SolutionService = SolutionService;
