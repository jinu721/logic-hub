import { PublicReportDTO } from "@modules/report/dtos";
import { ReportDocument } from "@modules/report";

export const toPublicReportDTO = (report: ReportDocument): PublicReportDTO => {
  return {
    _id: String(report._id),
    reporter: report.reporter,
    reportedType: report.reportedType,
    reportedId: String(report.reportedId),
    reason: report.reason,
    description: report.description,
    status: report.status,
    createdAt: report.createdAt,
  };
};

export const toPublicReportDTOs = (reports: ReportDocument[]): PublicReportDTO[] => {
  return reports.map(toPublicReportDTO);
};
