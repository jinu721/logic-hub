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
exports.SubmissionService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
class SubmissionService extends _core_1.BaseService {
    constructor(submissionRepo, userRepo) {
        super();
        this.submissionRepo = submissionRepo;
        this.userRepo = userRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicSubmissionDTO)(entity);
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicSubmissionDTOs)(entities);
    }
    createSubmission(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield this.submissionRepo.createSubmission(data);
            return this.mapOne(submission);
        });
    }
    getSubmissionsByUserAndChallenge(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, challengeId } = data;
            const submissions = yield this.submissionRepo.getSubmissionsByUserAndChallenge((0, application_1.toObjectId)(userId), (0, application_1.toObjectId)(challengeId));
            return this.mapMany(submissions);
        });
    }
    getSubmissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield this.submissionRepo.getSubmissionById((0, application_1.toObjectId)(id));
            if (!submission)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Submission not found");
            return this.mapOne(submission);
        });
    }
    getAllSubmissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield this.submissionRepo.getAllSubmissions();
            return this.mapMany(submissions);
        });
    }
    getRecentSubmissions(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.getUserByName(username);
            if (!user)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
            const submissions = yield this.submissionRepo.getRecentSubmissions(user._id);
            return this.mapMany(submissions);
        });
    }
    updateSubmission(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield this.submissionRepo.updateSubmission((0, application_1.toObjectId)(id), data);
            if (!submission)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Submission not found");
            return this.mapOne(submission);
        });
    }
    deleteSubmissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.submissionRepo.deleteSubmissionById((0, application_1.toObjectId)(id));
            if (!success)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Progress not found");
            return true;
        });
    }
    getAllSubmissionsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield this.submissionRepo.getAllSubmissionsByUser((0, application_1.toObjectId)(userId));
            return this.mapMany(submissions);
        });
    }
    getAllSubmissionsByChallenge(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield this.submissionRepo.getAllSubmissionsByChallenge((0, application_1.toObjectId)(challengeId));
            return this.mapMany(submissions);
        });
    }
    getUserHeatmapData(userId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const submissions = yield this.submissionRepo.getSubmissionsByUserAndYear((0, application_1.toObjectId)(userId), year);
            const map = {};
            if (!submissions || submissions.length === 0)
                return map;
            submissions.forEach((s) => {
                const date = s.submittedAt.toISOString().split("T")[0];
                map[date] = (map[date] || 0) + 1;
            });
            return map;
        });
    }
}
exports.SubmissionService = SubmissionService;
