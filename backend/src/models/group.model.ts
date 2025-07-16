import mongoose, { Schema, Document, Types } from 'mongoose';
import { GroupIF } from '../types/group.types';


const GroupSchema = new Schema<GroupIF>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    groupType: {
      type: String,
      enum: ['public-open', 'public-approval'],
      required: true,
      default: 'public-open',
    },
    userRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    voiceRoom: {
      topic: { type: String },
      scheduledFor: { type: Date },
      durationMinutes: { type: Number },
      isActive: { type: Boolean, default: false },
      host: { type: Schema.Types.ObjectId, ref: 'User' },
      startAt: { type: Date },
      endAt: { type: Date },
      participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      mutedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const Group = mongoose.model<GroupIF>('Group', GroupSchema);
