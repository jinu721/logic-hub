import {  Document, Types } from 'mongoose';

export type ReportedType = 'User' | 'Room' | 'Group';
export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved' | 'Rejected';

export interface ReportIF extends Document {
  reporter: Types.ObjectId;
  reportedType: ReportedType;
  reportedId: Types.ObjectId;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
}
