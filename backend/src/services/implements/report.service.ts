import { IReportService } from "../interfaces/report.service.interface";
import { IReportRepository } from "../../repository/interfaces/report.repository.interface";
import { ReportIF, ReportStatus } from "../../types/report.types";
import {
  GroupedReportDTO,
  PublicReportDTO,
  toPublicReportDTO,
  toPublicReportDTOs,
} from "../../mappers/report.dto";

export class ReportService implements IReportService {
  constructor(private reportRepo: IReportRepository) {}

  async createReport(data: ReportIF): Promise<PublicReportDTO> {
    const report = await this.reportRepo.createReport(data);
    return toPublicReportDTO(report as ReportIF);
  }

async getAllReports(
  filter: any,
  page: number,
  limit: number
): Promise<{ reports: GroupedReportDTO[]; totalItems: number }> {
  const query: any = {};
  if (filter.reportedType && filter.reportedType !== "all") {
    query.reportedType = filter.reportedType;
  }
  if (filter.status) {
    query.status = filter.status;
  }

  const skip = (page - 1) * limit;

  const groupedReports = await this.reportRepo.getAllReports(query, skip, limit);


  const result = groupedReports.map(group => {
    return {
      reportedId: group._id.toString(),
      reportedType: group.reportedType,
      totalReports: group.totalReports || group.reports.length,
      userInfo: group.userInfo || undefined,
      groupInfo: group.groupInfo || undefined,
      reports: toPublicReportDTOs(group.reports),
    };
  });

  const totalItems = await this.reportRepo.countAllReports(query);


  console.log("Total Counts",totalItems);
  console.log("Reports: ", result);

  return { reports: result, totalItems };
}


  async getReportById(id: string): Promise<PublicReportDTO | null> {
    const report = await this.reportRepo.getReportById(id);
    return toPublicReportDTO(report as ReportIF);
  }

  async updateReportStatus(
    id: string,
    status: ReportStatus
  ): Promise<PublicReportDTO | null> {
    const report = await this.reportRepo.updateReportStatus(id, status);
    return toPublicReportDTO(report as ReportIF);
  }
}
