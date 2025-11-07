import { ReportIF } from "@shared/types";
import { PublicReportDTO } from "@modules/report/dtos";

export const toPublicReportDTO = (report: ReportIF): PublicReportDTO => {
  return {
    _id: report._id ? report._id.toString() : "",
    reporter: report.reporter as any,
    reportedType: report.reportedType,
    reportedId: report.reportedId as any,
    reason: report.reason,
    description: report.description,
    status: report.status,
    createdAt: report.createdAt,
  };
};

export const toPublicReportDTOs = (reports: ReportIF[]): PublicReportDTO[] => {
  return reports.map(toPublicReportDTO);
};
