import { ReportModel, IReportRepository, ReportDocument } from "@modules/report";
import { BaseRepository } from "@core";
import { CreateReportInput, GetAllReportInput, GroupedReportDomain, ReportStatus } from "@shared/types";
import { toLean, toLeanMany } from "@utils/database/query.utils";


export class ReportRepository
  extends BaseRepository<ReportDocument>
  implements IReportRepository
{
  constructor() {
    super(ReportModel);
  }

  async createReport(data: CreateReportInput): Promise<ReportDocument> {
    const report = new this.model(data);
    return report.save();
  }


  async getAllReports(query: GetAllReportInput, skip: number, limit: number): Promise<GroupedReportDomain[]> {
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

  async countAllReports(query: GetAllReportInput): Promise<number> {
    return this.model.countDocuments(query);
  }

  async getReportById(id: string): Promise<ReportDocument | null> {
    return toLean<ReportDocument>(this.model.findById(id));
  }

  async updateReportStatus(
    id: string,
    status: ReportStatus
  ): Promise<ReportDocument | null> {
    return toLean<ReportDocument>(
      this.model.findByIdAndUpdate(id, { status }, { new: true })
    );
  }
}
