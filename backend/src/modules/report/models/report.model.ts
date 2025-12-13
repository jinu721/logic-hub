import { Document, model, Schema } from "mongoose";
import { ReportAttrs } from "@shared/types";

export interface ReportDocument extends ReportAttrs, Document {}

const reportSchema = new Schema<ReportDocument>({
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedType: {
      type: String,
      enum: ['User', 'Room', 'Group'],
      required: true
    },
    reportedId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  export const ReportModel = model<ReportDocument>('Report', reportSchema);