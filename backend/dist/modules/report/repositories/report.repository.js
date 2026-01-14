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
exports.ReportRepository = void 0;
const report_1 = require("../../report");
const _core_1 = require("../../../shared/core");
const query_utils_1 = require("../../../shared/utils/database/query.utils");
class ReportRepository extends _core_1.BaseRepository {
    constructor() {
        super(report_1.ReportModel);
    }
    createReport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = new this.model(data);
            return report.save();
        });
    }
    getAllReports(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield this.model.aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$reporter" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                            { $project: { username: 1, email: 1, _id: 1 } },
                        ],
                        as: "reporter",
                    },
                },
                { $unwind: "$reporter" },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$reportedId" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                            { $project: { username: 1, email: 1, _id: 1 } },
                        ],
                        as: "reportedUser",
                    },
                },
                {
                    $lookup: {
                        from: "groups",
                        localField: "reportedId",
                        foreignField: "_id",
                        as: "reportedGroup",
                    },
                },
                {
                    $group: {
                        _id: "$reportedId",
                        reportedType: { $first: "$reportedType" },
                        totalReports: { $sum: 1 },
                        reports: {
                            $push: {
                                reason: "$reason",
                                status: "$status",
                                createdAt: "$createdAt",
                                reporter: "$reporter",
                            },
                        },
                        userInfo: { $first: { $arrayElemAt: ["$reportedUser", 0] } },
                        groupInfo: { $first: { $arrayElemAt: ["$reportedGroup", 0] } },
                    },
                },
                { $skip: skip },
                { $limit: limit },
            ]);
            return reports;
        });
    }
    countAllReports(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(query);
        });
    }
    getReportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, query_utils_1.toLean)(this.model.findById(id));
        });
    }
    updateReportStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, query_utils_1.toLean)(this.model.findByIdAndUpdate(id, { status }, { new: true }));
        });
    }
}
exports.ReportRepository = ReportRepository;
