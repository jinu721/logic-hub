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
exports.ChallengeCommandService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
class ChallengeCommandService extends _core_1.BaseService {
    constructor(challengeRepo) {
        super();
        this.challengeRepo = challengeRepo;
    }
    toDTO(challenge) {
        return (0, dtos_1.toPublicChallengeDTO)(challenge);
    }
    toDTOs(challenges) {
        return (0, dtos_1.toPublicChallengeDTOs)(challenges);
    }
    parseValue(value) {
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
            return value;
        }
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                return value;
            }
        }
        return value;
    }
    normalizeTestCases(testCases) {
        return testCases.map((tc) => (Object.assign(Object.assign({}, tc), { input: this.parseValue(tc.input), output: this.parseValue(tc.output) })));
    }
    createChallenge(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.testCases) {
                data.testCases = this.normalizeTestCases(data.testCases);
            }
            const created = yield this.challengeRepo.createChallenge(data);
            return this.mapOne(created);
        });
    }
    updateChallenge(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.testCases) {
                data.testCases = this.normalizeTestCases(data.testCases);
            }
            const updated = yield this.challengeRepo.updateChallenge(typeof id === "string" ? (0, application_1.toObjectId)(id) : id, data);
            if (!updated)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            return this.mapOne(updated);
        });
    }
    deleteChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.challengeRepo.deleteChallenge(typeof id === "string" ? (0, application_1.toObjectId)(id) : id);
            if (!success)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            return true;
        });
    }
}
exports.ChallengeCommandService = ChallengeCommandService;
