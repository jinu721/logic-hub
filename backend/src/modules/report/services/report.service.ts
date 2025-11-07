import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicReportDTO,
  toPublicReportDTO,
  toPublicReportDTOs,
  GroupedReportDTO
} from "@modules/report/dtos";

import { IReportService, IReportRepository } from "@modules/report";
import { ReportIF, ReportStatus } from "@shared/types";


export class ReportService
  extends BaseService<ReportIF, PublicReportDTO>
  implements IReportService
{
  constructor(private readonly reportRepo: IReportRepository) {
    super()
  }

  protected toDTO(entity: ReportIF): PublicReportDTO {
    return toPublicReportDTO(entity)
  }

  protected toDTOs(entities: ReportIF[]): PublicReportDTO[] {
    return toPublicReportDTOs(entities)
  }

  async createReport(data: ReportIF): Promise<PublicReportDTO> {
    const report = await this.reportRepo.createReport(data)
    return this.mapOne(report)
  }

  async getAllReports(
    filter: any,
    page: number,
    limit: number
  ): Promise<{ reports: GroupedReportDTO[]; totalItems: number }>
  {
    const query: any = {}

    if (filter.reportedType && filter.reportedType !== "all") {
      query.reportedType = filter.reportedType
    }
    if (filter.status) {
      query.status = filter.status
    }

    const skip = (page - 1) * limit

    const groupedReports = await this.reportRepo.getAllReports(query, skip, limit)
    const totalItems = await this.reportRepo.countAllReports(query)

    const reports = groupedReports.map(group => ({
      reportedId: group._id.toString(),
      reportedType: group.reportedType,
      totalReports: group.totalReports || group.reports.length,
      userInfo: group.userInfo || undefined,
      groupInfo: group.groupInfo || undefined,
      reports: toPublicReportDTOs(group.reports)
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
