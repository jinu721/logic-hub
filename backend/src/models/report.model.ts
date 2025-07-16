import { model, Schema } from "mongoose";
import { ReportIF } from "../types/report.types";

const reportSchema = new Schema<ReportIF>({
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
  
  export const Report = model<ReportIF>('Report', reportSchema);