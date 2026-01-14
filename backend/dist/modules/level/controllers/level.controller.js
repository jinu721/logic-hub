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
exports.LevelController = void 0;
const dtos_1 = require("../../level/dtos");
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
class LevelController {
    constructor(_levelSvc) {
        this._levelSvc = _levelSvc;
        this.updateUserLevel = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateUserLevelDto.from({ userId: req.params.userId, xpPoints: req.body.xpPoints });
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const userLevel = yield this._levelSvc.updateUserLevel(dto.userId, dto.xpPoints);
            if (!userLevel) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "User level could not be updated");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, userLevel, "User level updated successfully");
        }));
        this.createLevel = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateLevelDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const level = yield this._levelSvc.createLevel(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, level, "Level created successfully");
        }));
        this.getAllLevels = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetAllLevelsDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const page = dto.page ? Number(dto.page) : 1;
            const limit = dto.limit ? Number(dto.limit) : 10;
            const levels = yield this._levelSvc.getAllLevels(page, limit);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, levels, "Levels fetched successfully");
        }));
        this.getLevelById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetLevelDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const level = yield this._levelSvc.getLevelById(dto.id);
            if (!level) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Level not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, level, "Level fetched successfully");
        }));
        this.updateLevel = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateLevelDto.from(Object.assign(Object.assign({}, req.body), { id: req.params.id }));
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const level = yield this._levelSvc.updateLevel(dto.id, dto);
            if (!level) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Level not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, level, "Level updated successfully");
        }));
        this.deleteLevel = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteLevelDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const level = yield this._levelSvc.deleteLevel(dto.id);
            if (!level) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Level not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, level, "Level deleted successfully");
        }));
    }
}
exports.LevelController = LevelController;
