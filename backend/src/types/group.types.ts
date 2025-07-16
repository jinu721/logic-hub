import { Document, Types } from 'mongoose';

export interface GroupIF extends Document {
  name: string;
  description?: string;
  image?: string;
  createdBy: Types.ObjectId;
  admins: Types.ObjectId[];
  members: Types.ObjectId[];
  groupType: 'public-open' | 'public-approval';
  userRequests: Types.ObjectId[];
  voiceRoom?: {
    topic?: string;
    scheduledFor?: Date;
    durationMinutes?: number;
    isActive: boolean;
    host: Types.ObjectId;
    participants: Types.ObjectId[];
    startAt: Date;
    endAt: Date;
    mutedUsers: Types.ObjectId[];
  };
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
}