import { GetReportsFilterDto, GroupedReportDTO, PublicReportDTO } from "@modules/report/dtos";
import { CreateReportInput, ReportStatus } from "@shared/types";

export interface IReportService {
  createReport(data: CreateReportInput): Promise<PublicReportDTO>;
  getAllReports(data: GetReportsFilterDto): Promise<{ reports: GroupedReportDTO[], totalItems: number }>;
  getReportById(id: string): Promise<PublicReportDTO | null>;
  updateReportStatus(id: string, status: ReportStatus): Promise<PublicReportDTO | null>;
}
