import { Report } from "../../models/report.model";
import { BaseRepository } from "../base.repository";
import { IReportRepository } from "../interfaces/report.repository.interface";
import { ReportIF, ReportStatus } from "../../types/report.types";
import { toLean, toLeanMany } from "../../utils/database/query.utils";

export class ReportRepository
  extends BaseRepository<ReportIF>
  implements IReportRepository
{
  constructor() {
    super(Report);
  }

  async createReport(data: ReportIF): Promise<ReportIF> {
    const report = new this.model(data);
    return toLean<ReportIF>(report.save());
  }

  async getAllReports(query: any, skip: number, limit: number): Promise<any[]> {
    const reports = await this.model.aggregate([
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
  }

  async countAllReports(query: any): Promise<number> {
    return this.model.countDocuments(query);
  }

  async getReportById(id: string): Promise<ReportIF | null> {
    return toLean<ReportIF>(this.model.findById(id));
  }

  async updateReportStatus(
    id: string,
    status: ReportStatus
  ): Promise<ReportIF | null> {
    return toLean<ReportIF>(
      this.model.findByIdAndUpdate(id, { status }, { new: true })
    );
  }
}
