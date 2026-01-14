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
exports.SolutionController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../challenge/dtos");
const solution_user_query_dto_1 = require("../dtos/requests/solution-user-query.dto");
const like_solution_dto_1 = require("../dtos/requests/like-solution.dto");
const delete_comment_dto_1 = require("../dtos/requests/delete-comment.dto");
class SolutionController {
    constructor(_solutionSvc) {
        this._solutionSvc = _solutionSvc;
        this.createSolution = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.CreateSolutionRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this._solutionSvc.addSolution(Object.assign(Object.assign({}, dto), { user: userId }));
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, result);
        }));
        this.getSolutionsByChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.SolutionQueryDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this._solutionSvc.getSolutionsByChallenge(req.params.challengeId, dto.search, dto.page, dto.limit, dto.sortBy);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.getSolutionsByUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = solution_user_query_dto_1.SolutionUserQueryDto.from({ userId: req.params.userId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this._solutionSvc.getSolutionsByUser(dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.likeSolution = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = like_solution_dto_1.LikeSolutionDto.from({ solutionId: req.params.solutionId, userId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = valid.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this._solutionSvc.likeSolution(dto.solutionId, dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.commentSolution = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.CommentSolutionRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this._solutionSvc.commentSolution(userId, dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.deleteComment = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = delete_comment_dto_1.DeleteCommentDto.from({
                solutionId: req.params.solutionId,
                commentId: req.params.commentId,
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this._solutionSvc.deleteComment(dto.solutionId, dto.commentId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.updateSolution = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateSolutionDto.from({
                solutionId: req.params.solutionId,
                payload: req.body,
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this._solutionSvc.updateSolution(dto.solutionId, dto.payload);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.deleteSolution = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this._solutionSvc.deleteSolution(req.params.solutionId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.NO_CONTENT, null);
        }));
    }
}
exports.SolutionController = SolutionController;
