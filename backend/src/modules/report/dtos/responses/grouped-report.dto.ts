import { PublicUserDTO} from "@modules/user/dtos";
import { PublicReportDTO } from "@modules/report/dtos";

export interface GroupedReportDTO {
  reportedId: string;
  reportedType: "User" | "Group" | "Room";
  totalReports: number;
  userInfo?: PublicUserDTO;
  groupInfo?: any; 
  reports: PublicReportDTO[];
}
