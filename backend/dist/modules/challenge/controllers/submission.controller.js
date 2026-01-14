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
exports.SubmissionController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../challenge/dtos");
class SubmissionController {
    constructor(_submissionSvc) {
        this._submissionSvc = _submissionSvc;
        this.createSubmission = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.CreateSubmissionRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const createdSubmission = yield this._submissionSvc.createSubmission({
                challengeId: dto.challengeId,
                userId,
                passed: false, // Will be updated after execution
                xpGained: 0, // Will be updated after execution
                score: 0, // Will be updated after execution
                timeTaken: 0, // Will be updated after execution
                level: "novice", // Default level
                type: "practice", // Default type
                tags: [], // Default empty tags
                challengeVersion: 1, // Default version
                submittedAt: new Date(),
                status: "pending",
                execution: {
                    language: dto.language,
                    codeSubmitted: dto.userCode,
                    resultOutput: null,
                    testCasesPassed: 0,
                    totalTestCases: 0,
                }
            });
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, createdSubmission, "Submission created successfully");
        }));
        this.getSubmissionsByUserAndChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.SubmissionsUserChallengeDto.from({
                userId: req.params.userId,
                challengeId: req.params.challengeId
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const submissions = yield this._submissionSvc.getSubmissionsByUserAndChallenge(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submissions);
        }));
        this.getSubmissionById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.SubmissionIdDto.from({ id: req.params.id });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const submission = yield this._submissionSvc.getSubmissionById(dto.id);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submission);
        }));
        this.getAllSubmissions = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const submissions = yield this._submissionSvc.getAllSubmissions();
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submissions, "All submissions fetched successfully");
        }));
        this.getRecentSubmissions = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.username;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const targetUserId = req.params.input === "me" ? userId : req.params.input;
            const submissions = yield this._submissionSvc.getRecentSubmissions(targetUserId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submissions, "Recent submissions fetched successfully");
        }));
        this.updateSubmission = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateSubmissionDto.from({
                id: req.params.id,
                payload: req.body
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const updated = yield this._submissionSvc.updateSubmission(dto.id, dto.payload);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, updated);
        }));
        this.deleteSubmission = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteSubmissionDto.from({ id: req.params.id });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this._submissionSvc.deleteSubmissionById(dto.id);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result);
        }));
        this.getAllSubmissionsByUser = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const dto = dtos_1.SubmissionsByUserDto.from({ userId: req.params.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = valid.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const submissions = yield this._submissionSvc.getAllSubmissionsByUser(dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submissions);
        }));
        this.getAllSubmissionsByChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.SubmissionsByChallengeDto.from({ challengeId: req.params.challengeId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const submissions = yield this._submissionSvc.getAllSubmissionsByChallenge(dto.challengeId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, submissions);
        }));
        this.getHeatmap = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const loggedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!loggedUserId)
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const userParam = req.params.userId;
            const userId = userParam === "me" ? loggedUserId : userParam;
            if (!userId)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, "User ID is required");
            const dto = dtos_1.GetHeatmapRequestDto.from({
                year: req.query.year ? Number(req.query.year) : undefined,
                userId
            });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            }
            const year = (_c = dto.year) !== null && _c !== void 0 ? _c : new Date().getFullYear();
            const progress = yield this._submissionSvc.getUserHeatmapData(dto.userId, year);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, progress, "User heatmap data fetched successfully");
        }));
    }
}
exports.SubmissionController = SubmissionController;
