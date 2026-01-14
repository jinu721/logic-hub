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
exports.ReportService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../report/dtos");
class ReportService extends _core_1.BaseService {
    constructor(reportRepo) {
        super();
        this.reportRepo = reportRepo;
    }
    toDTO(entity) {
        return (0, dtos_1.toPublicReportDTO)(entity);
    }
    toDTOs(entities) {
        return (0, dtos_1.toPublicReportDTOs)(entities);
    }
    createReport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.reportRepo.createReport(data);
            return this.mapOne(report);
        });
    }
    getAllReports(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const query = {};
            if (data.reportedType && data.reportedType !== "All") {
                query.reportedType = data.reportedType;
            }
            if (data.status) {
                query.status = data.status;
            }
            const skip = (((_a = data.page) !== null && _a !== void 0 ? _a : 1) - 1) * ((_b = data.limit) !== null && _b !== void 0 ? _b : 10);
            const limit = (_c = data.limit) !== null && _c !== void 0 ? _c : 10;
            const groupedReports = yield this.reportRepo.getAllReports(query, skip, limit);
            const totalItems = yield this.reportRepo.countAllReports(query);
            const reports = groupedReports.map(group => ({
                reportedId: group._id.toString(),
                reportedType: group.reportedType,
                totalReports: group.totalReports,
                userInfo: group.userInfo
                    ? {
                        _id: group.userInfo._id.toString(),
                        username: group.userInfo.username,
                        email: group.userInfo.email,
                    }
                    : undefined,
                groupInfo: group.groupInfo
                    ? {
                        _id: group.groupInfo._id.toString(),
                        name: group.groupInfo.name,
                    }
                    : undefined,
                reports: group.reports
            }));
            return { reports, totalItems };
        });
    }
    getReportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.reportRepo.getReportById(id);
            if (!report) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Report not found");
            }
            return this.mapOne(report);
        });
    }
    updateReportStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.reportRepo.updateReportStatus(id, status);
            if (!updated) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Report not found");
            }
            return this.mapOne(updated);
        });
    }
}
exports.ReportService = ReportService;
