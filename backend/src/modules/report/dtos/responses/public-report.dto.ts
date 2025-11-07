import { PublicUserDTO} from "@modules/user/dtos";

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