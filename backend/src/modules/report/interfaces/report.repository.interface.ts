import { CreateReportInput, GetAllReportInput, GroupedReportDomain, ReportStatus } from "@shared/types";
import { ReportDocument } from "@modules/report";

export interface IReportRepository {
  createReport(data: CreateReportInput): Promise<ReportDocument>;
  getAllReports(query: GetAllReportInput, skip: number, limit: number): Promise<GroupedReportDomain[]>;
  countAllReports(query: GetAllReportInput): Promise<number>;
  getReportById(id: string): Promise<ReportDocument | null>;
  updateReportStatus(id: string, status: ReportStatus): Promise<ReportDocument | null>;
}
