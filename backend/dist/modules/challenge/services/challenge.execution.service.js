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
exports.ChallengeExecutionService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../challenge/dtos");
const _execution_1 = require("../../../execution");
class ChallengeExecutionService extends _core_1.BaseService {
    constructor(challengeRepo, submissionRepo) {
        super();
        this.challengeRepo = challengeRepo;
        this.submissionRepo = submissionRepo;
    }
    toDTO(challenge) {
        return (0, dtos_1.toPublicChallengeDTO)(challenge);
    }
    toDTOs(challenges) {
        return (0, dtos_1.toPublicChallengeDTOs)(challenges);
    }
    parseOutput(stdout) {
        try {
            return JSON.parse(stdout || "{}");
        }
        catch (_a) {
            return { error: "Invalid JSON from runner", rawOutput: stdout };
        }
    }
    buildResults(parsed, testCases) {
        const list = Array.isArray(parsed.results) ? parsed.results : [];
        const mapped = (list.length
            ? list
            : testCases.map((t) => ({
                input: t.input,
                expected: t.output,
                actual: null,
                error: parsed.error || "No runner results",
            }))).map((r) => {
            var _a, _b, _c, _d;
            const actual = (_a = r.actual) !== null && _a !== void 0 ? _a : null;
            const expected = (_b = r.expected) !== null && _b !== void 0 ? _b : null;
            const error = (_c = r.error) !== null && _c !== void 0 ? _c : null;
            const passed = error ? false : (0, _execution_1.deepEqual)(actual, expected);
            return { input: (_d = r.input) !== null && _d !== void 0 ? _d : null, expected, actual, error, passed };
        });
        return {
            results: mapped,
            allPassed: mapped.every((r) => r.passed),
        };
    }
    runChallengeCode(challengeId, language, userCode, _input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const challenge = yield this.challengeRepo.getChallengeById((0, application_1.toObjectId)(challengeId));
            if (!challenge)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            if (challenge.type === "cipher") {
                const results = (challenge.testCases || []).slice(0, 3).map((t) => {
                    const passed = String(userCode || "").trim().toLowerCase() === String(t.output || "").trim().toLowerCase();
                    return {
                        input: t.input,
                        expected: t.output,
                        actual: userCode,
                        passed,
                        error: null
                    };
                });
                return {
                    userId,
                    challengeId,
                    language,
                    results,
                    allPassed: results.some(r => r.passed),
                    rawExec: { info: "Cipher evaluation" }
                };
            }
            if (!challenge.functionName)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Function signature missing");
            const testCases = (challenge.testCases || []).slice(0, 3);
            const funcName = challenge.functionName;
            const wrapperFiles = (0, _execution_1.generateExecutableFiles)(language, userCode, funcName);
            const sourceCode = wrapperFiles[0].content;
            const stdinPayload = JSON.stringify({
                funcName,
                testcases: testCases.map((t) => {
                    var _a;
                    return ({
                        input: (_a = t.input) !== null && _a !== void 0 ? _a : [],
                        expected: t.output,
                    });
                }),
            });
            const langId = _execution_1.judge0Languages[(language || "").toLowerCase()];
            if (!langId)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Unsupported language");
            const exec = yield (0, _execution_1.runCodeWithJudge0)(langId, sourceCode, stdinPayload);
            const parsed = this.parseOutput((_a = exec.run) === null || _a === void 0 ? void 0 : _a.stdout);
            const { results, allPassed } = this.buildResults(parsed, testCases);
            return {
                userId,
                challengeId,
                language,
                results,
                allPassed,
                rawExec: (_b = exec.raw) !== null && _b !== void 0 ? _b : exec,
            };
        });
    }
    submitChallenge(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const { challengeId, userCode, language } = data;
            const challenge = yield this.challengeRepo.getChallengeById((0, application_1.toObjectId)(challengeId));
            if (!challenge)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Challenge not found");
            let results = [];
            let allPassed = false;
            let execDetails = {};
            let runTime = 0;
            let memoryUsed = 0;
            let cpuTime = 0;
            let compileError = null;
            let judgeStatus = "completed";
            if (challenge.type === "cipher") {
                results = (challenge.testCases || []).map((t) => {
                    const passed = String(userCode || "").trim().toLowerCase() === String(t.output || "").trim().toLowerCase();
                    return {
                        input: t.input,
                        expected: t.output,
                        actual: userCode,
                        passed,
                        error: null
                    };
                });
                allPassed = results.some((r) => r.passed);
                runTime = 0;
            }
            else {
                if (!challenge.functionName)
                    throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Function signature missing");
                const funcName = challenge.functionName;
                const wrapperFiles = (0, _execution_1.generateExecutableFiles)(language, userCode, funcName);
                const sourceCode = wrapperFiles[0].content;
                const testCases = challenge.testCases || [];
                const stdinPayload = JSON.stringify({
                    funcName,
                    testcases: testCases.map((t) => {
                        var _a;
                        return ({
                            input: (_a = t.input) !== null && _a !== void 0 ? _a : [],
                            expected: t.output,
                        });
                    }),
                });
                const langId = _execution_1.judge0Languages[(language || "").toLowerCase()];
                if (!langId)
                    throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "Unsupported language");
                const exec = yield (0, _execution_1.runCodeWithJudge0)(langId, sourceCode, stdinPayload);
                const parsed = this.parseOutput((_a = exec.run) === null || _a === void 0 ? void 0 : _a.stdout);
                const built = this.buildResults(parsed, testCases);
                results = built.results;
                allPassed = built.allPassed;
                execDetails = (_b = exec.raw) !== null && _b !== void 0 ? _b : exec;
                runTime = (_d = (_c = exec.run) === null || _c === void 0 ? void 0 : _c.time) !== null && _d !== void 0 ? _d : 0;
                memoryUsed = (_f = (_e = exec.run) === null || _e === void 0 ? void 0 : _e.memory) !== null && _f !== void 0 ? _f : 0;
                cpuTime = (_h = (_g = exec.run) === null || _g === void 0 ? void 0 : _g.cpuTime) !== null && _h !== void 0 ? _h : 0;
                compileError = (_k = (_j = exec.run) === null || _j === void 0 ? void 0 : _j.compileOutput) !== null && _k !== void 0 ? _k : null;
                judgeStatus = (_m = (_l = exec.run) === null || _l === void 0 ? void 0 : _l.resultStatus) !== null && _m !== void 0 ? _m : "completed";
            }
            const passRatio = results.length > 0 ? results.filter((r) => r.passed).length / results.length : 0;
            const levelWeight = challenge.level === "master" ? 3 : challenge.level === "adept" ? 2 : 1;
            const score = Math.max(1, Math.round((passRatio * levelWeight * 2000) / (runTime + 1)));
            yield this.submissionRepo.createSubmission({
                userId: userId,
                challengeId: challengeId,
                xpGained: challenge.xpRewards,
                passed: allPassed,
                score,
                timeTaken: runTime,
                type: challenge.type,
                level: challenge.level,
                tags: challenge.tags || [],
                challengeVersion: 1,
                status: allPassed
                    ? "completed"
                    : judgeStatus.includes("Time")
                        ? "failed-timeout"
                        : "failed-output",
                submittedAt: new Date(),
                execution: {
                    language,
                    codeSubmitted: userCode,
                    resultOutput: { results },
                    testCasesPassed: results.filter((r) => r.passed).length,
                    totalTestCases: results.length,
                    runTime,
                    memoryUsed,
                    cpuTime,
                    compileError,
                },
            });
            // Calculate XP gained based on challenge level and performance
            const baseXP = challenge.level === "novice" ? 10 : challenge.level === "adept" ? 20 : 30;
            const xpGained = allPassed ? Math.round(baseXP * (score / 100)) : 0;
            return {
                challengeId,
                userId,
                language,
                passed: allPassed,
                score,
                timeTaken: runTime,
                results,
                rawExec: execDetails,
                xpGained,
            };
        });
    }
}
exports.ChallengeExecutionService = ChallengeExecutionService;
