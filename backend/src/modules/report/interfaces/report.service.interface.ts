import { GroupedReportDTO, PublicReportDTO } from "@modules/report/dtos";
import { ReportIF, ReportStatus } from "@shared/types";

export interface IReportService {
  createReport(data: ReportIF): Promise<PublicReportDTO>;
  getAllReports(filter: any, page: number, limit?: number): Promise<{reports: GroupedReportDTO[], totalItems: number}>;
  getReportById(id: string): Promise<PublicReportDTO | null>;
  updateReportStatus(id: string, status: ReportStatus): Promise<PublicReportDTO | null>;
}
