import { ReportIF, ReportStatus } from "../../shared/types/report.types";

export interface IReportRepository {
  createReport(data: ReportIF): Promise<ReportIF>;
  getAllReports(query: any, skip: number, limit: number): Promise<any[]>;
  countAllReports(query: any): Promise<number>;
  getReportById(id: string): Promise<ReportIF | null>;
  updateReportStatus(id: string, status: ReportStatus): Promise<ReportIF | null>;
}
