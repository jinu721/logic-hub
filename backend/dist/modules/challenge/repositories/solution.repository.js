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
exports.SolutionRepository = void 0;
const core_1 = require("../../../shared/core");
const challenge_1 = require("../../challenge");
class SolutionRepository extends core_1.BaseRepository {
    constructor() {
        super(challenge_1.SolutionModel);
    }
    getSolutionById(solutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findById(solutionId)
                .populate("user")
                .populate("comments.user");
        });
    }
    createSolution(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    findSolutionsByChallenge(query, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("user")
                .populate("comments.user");
        });
    }
    findSolutionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find({ user: userId })
                .populate("user")
                .populate("comments.user");
        });
    }
    likeSolution(solutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(solutionId, { $addToSet: { likes: userId } }, { new: true });
        });
    }
    checkUserLikedSolution(solutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne({ _id: solutionId, likes: userId });
            return !!result;
        });
    }
    unlikeSolution(solutionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(solutionId, { $pull: { likes: userId } }, { new: true });
        });
    }
    commentSolution(solutionId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findByIdAndUpdate(solutionId, {
                $push: {
                    comments: {
                        user: comment.user,
                        content: comment.content,
                    },
                },
            }, { new: true });
        });
    }
    deleteComment(solutionId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(solutionId, { $pull: { comments: { _id: commentId } } }, { new: true });
        });
    }
    updateSolution(solutionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findByIdAndUpdate(solutionId, data, { new: true });
        });
    }
    deleteSolution(solutionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.model.findByIdAndDelete(solutionId);
            return !!success;
        });
    }
}
exports.SolutionRepository = SolutionRepository;
