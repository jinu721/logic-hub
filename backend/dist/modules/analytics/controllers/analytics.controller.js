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
exports.AnalyticsController = void 0;
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../analytics/dtos");
class AnalyticsController {
    constructor(_analyticsSvc) {
        this._analyticsSvc = _analyticsSvc;
        this.getUserAnalytics = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this._analyticsSvc.fetchUserAnalytics();
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, data, "User analytics fetched successfully");
        }));
        this.getChallengeStats = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this._analyticsSvc.fetchChallengeStats();
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, data, "Challenge stats fetched successfully");
        }));
        this.getLeaderboardData = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.LeaderboardQueryDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const data = yield this._analyticsSvc.getLeaderboardData(dto.based, dto.category, dto.period, dto.order, dto.page, dto.limit);
            (0, application_1.sendSuccess)(res, _constants_1.HttpStatus.OK, data, "Leaderboard trends fetched successfully");
        }));
    }
}
exports.AnalyticsController = AnalyticsController;
