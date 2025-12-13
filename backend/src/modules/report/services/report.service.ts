import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicReportDTO,
  toPublicReportDTO,
  toPublicReportDTOs,
  GroupedReportDTO
} from "@modules/report/dtos";

import { IReportService, IReportRepository, ReportDocument } from "@modules/report";
import { CreateReportInput, GetAllReportInput, ReportStatus } from "@shared/types";


export class ReportService
  extends BaseService<ReportDocument, PublicReportDTO>
  implements IReportService {
  constructor(private readonly reportRepo: IReportRepository) {
    super()
  }

  protected toDTO(entity: ReportDocument): PublicReportDTO {
    return toPublicReportDTO(entity)
  }

  protected toDTOs(entities: ReportDocument[]): PublicReportDTO[] {
    return toPublicReportDTOs(entities)
  }

  async createReport(data: CreateReportInput): Promise<PublicReportDTO> {
    const report = await this.reportRepo.createReport(data)
    return this.mapOne(report)
  }

  async getAllReports(data: GetAllReportInput): Promise<{ reports: GroupedReportDTO[]; totalItems: number }> {
    const query: GetAllReportInput = {}

    if (data.reportedType && data.reportedType !== "All") {
      query.reportedType = data.reportedType
    }
    if (data.status) {
      query.status = data.status
    }

    const skip = ((data.page ?? 1) - 1) * (data.limit ?? 10)
    const limit = data.limit ?? 10

    const groupedReports = await this.reportRepo.getAllReports(query, skip, limit)
    const totalItems = await this.reportRepo.countAllReports(query)

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
    }))


    return { reports, totalItems }
  }

  async getReportById(id: string): Promise<PublicReportDTO> {
    const report = await this.reportRepo.getReportById(id)
    if (!report) {
      throw new AppError(HttpStatus.NOT_FOUND, "Report not found")
    }
    return this.mapOne(report)
  }

  async updateReportStatus(id: string, status: ReportStatus): Promise<PublicReportDTO> {
    const updated = await this.reportRepo.updateReportStatus(id, status)
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Report not found")
    }
    return this.mapOne(updated)
  }
}
