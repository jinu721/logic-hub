import { GroupedReportDTO, PublicReportDTO } from "../../mappers/report.dto";
import { ReportIF, ReportStatus } from "../../types/report.types";

export interface IReportService {
  createReport(data: ReportIF): Promise<PublicReportDTO>;
  getAllReports(filter: any, page: number, limit?: number): Promise<{reports: GroupedReportDTO[], totalItems: number}>;
  getReportById(id: string): Promise<PublicReportDTO | null>;
  updateReportStatus(id: string, status: ReportStatus): Promise<PublicReportDTO | null>;
}
