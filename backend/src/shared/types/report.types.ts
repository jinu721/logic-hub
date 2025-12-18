import { Document, Types } from 'mongoose';
import { PaginationInput } from './core.types';
import { PublicGroupDTO } from '@modules/chat';
import { ReportDocument } from '@modules/report';

export type ReportedType =  'User' | 'Room' | 'Group';
export type ReportFilterType = "All" | "User" | "Room" | "Group";
export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved' | 'Rejected';


export interface ReportAttrs {
  reporter: Types.ObjectId;
  reportedType: ReportedType;
  reportedId: Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
}

export interface ReportDocument extends ReportAttrs, Document{}

export interface CreateReportInput{
  reporter: Types.ObjectId;
  reportedType: ReportedType;
  reportedId: Types.ObjectId;
  reason: string;
  description?: string;
}

export interface GetAllReportInput extends PaginationInput{
  reportedType?: ReportFilterType;
  status?: ReportStatus;
}

export interface GroupedReportItemDomain {
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  reporter: BasicUserInfo;
}


export interface BasicUserInfo {
  _id: Types.ObjectId;
  username: string;
  email: string;
}

export interface BasicGroupInfo {
  _id: Types.ObjectId;
  name: string;
}

export interface GroupedReportDomain {
  _id: Types.ObjectId;
  reportedType: ReportedType;
  totalReports: number;

  userInfo?: BasicUserInfo;
  groupInfo?: BasicGroupInfo;

  reports: GroupedReportItemDomain[];
}


