
export type ReportedType = 'User' | 'Room' | 'Group';
type ReportStatus = "Pending" | "Reviewed" | "Resolved" | "Rejected";

export interface ReportIF {
  _id?: string;
  reporter: string;
  reportedType: ReportedType;
  reportedId: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
}





export type Report = {
  _id: string;
  reason: string;
  reportedType: ReportedType;
  createdAt: string;
  status: ReportStatus;
  description?: string;
  reporter?: {
    username?: string;
  };
};

export type GroupedReport = {
  _id: string;
  userInfo?: {
    username: string;
  };
  groupInfo?: {
    name: string;
  };
  reports: Report[];
};