import { PublicReportDTO } from "@modules/report/dtos";
import { GroupedReportItemDomain, ReportedType } from "@shared/types";

export interface GroupedReportDTO {
  reportedId: string;
  reportedType: ReportedType;
  totalReports: number;

  userInfo?: {
    _id: string;
    username: string;
    email: string;
  };

  groupInfo?: {
    _id: string;
    name: string;
  };

  reports: GroupedReportItemDomain[];
}

export interface GroupedReportDTOs {
  items: GroupedReportDTO[];
  totalItems: number;
}

export interface GetReportsFilterDto{
    page:number,
    limit:number,
    reportedType?:ReportedType
}