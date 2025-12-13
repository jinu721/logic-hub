import { Schema, model } from 'mongoose';
import { GroupDocument } from '@shared/types';


const GroupSchema = new Schema<GroupDocument>(
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

export const GroupModel = model<GroupDocument>('Group', GroupSchema);
