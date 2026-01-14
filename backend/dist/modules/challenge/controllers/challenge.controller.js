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
exports.ChallengeController = void 0;
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../challenge/dtos");
class ChallengeController {
    constructor(querySvc, commandSvc, execSvc, statsSvc) {
        this.querySvc = querySvc;
        this.commandSvc = commandSvc;
        this.execSvc = execSvc;
        this.statsSvc = statsSvc;
        this.getChallengeById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.GetChallengeByIdDto.from({ challengeId: req.params.challengeId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = valid.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this.querySvc.getChallengeById(dto.challengeId, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.getUserHomeChallenges = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.UserHomeFiltersDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this.querySvc.getUserHomeChallenges(dto, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.getAllChallenges = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetAllChallengesDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.querySvc.getAllChallenges(dto.search, dto.page, dto.limit);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.createChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateChallengeRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.commandSvc.createChallenge(dto);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.CREATED, result);
        }));
        this.updateChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateChallengeDto.from({
                challengeId: req.params.challengeId,
                payload: req.body
            });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const result = yield this.commandSvc.updateChallenge(dto.challengeId, dto.payload);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.deleteChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteChallengeDto.from({ challengeId: req.params.challengeId });
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = valid.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            yield this.commandSvc.deleteChallenge((0, application_1.toObjectId)(dto.challengeId));
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, null);
        }));
        this.runChallengeCode = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.RunCodeRequestDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const result = yield this.execSvc.runChallengeCode(dto.challengeId, dto.language, dto.sourceCode, dto.input, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, result);
        }));
        this.submitChallenge = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const dto = dtos_1.SubmitChallengeDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const execResult = yield this.execSvc.submitChallenge(dto, userId);
            const statsResult = yield this.statsSvc.applySubmissionEffects(execResult, userId);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, Object.assign(Object.assign({}, execResult), statsResult));
        }));
    }
}
exports.ChallengeController = ChallengeController;
