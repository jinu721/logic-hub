import { ReportIF } from "../shared/types/report.types";
import { PublicUserDTO} from "./user.dto";

export interface PublicReportDTO {
  _id: string;
  reporter: PublicUserDTO; 
  reportedType: "User" | "Room" | "Group";
  reportedId: string;
  reason: string;
  description?: string;
  status: "Pending" | "Reviewed" | "Resolved" | "Rejected";
  createdAt: Date;
}


export interface GroupedReportDTO {
  reportedId: string;
  reportedType: "User" | "Group" | "Room";
  totalReports: number;
  userInfo?: PublicUserDTO;
  groupInfo?: any; 
  reports: PublicReportDTO[];
}



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
