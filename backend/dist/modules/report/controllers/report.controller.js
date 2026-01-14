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
exports.ReportController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
const dtos_1 = require("../../report/dtos");
class ReportController {
    constructor(_reportSvc) {
        this._reportSvc = _reportSvc;
        this.createReport = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const dto = dtos_1.CreateReportDto.from(Object.assign({ reporter: userId }, req.body));
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_b = validation.errors) === null || _b === void 0 ? void 0 : _b.join(", "));
            const report = yield this._reportSvc.createReport(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, report, "Report created successfully");
        }));
        this.getAllReports = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetAllReportsDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const reports = yield this._reportSvc.getAllReports(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, reports, "Reports fetched successfully");
        }));
        this.getReportById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetReportDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            const report = yield this._reportSvc.getReportById(dto.id);
            if (!report) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Report not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, report, "Report fetched successfully");
        }));
        this.updateReportStatus = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateReportStatusDto.from(Object.assign({ id: req.params.id }, req.body));
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, (_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", "));
            }
            const updatedReport = yield this._reportSvc.updateReportStatus(dto.id, dto.status);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, updatedReport, "Report status updated successfully");
        }));
    }
}
exports.ReportController = ReportController;
