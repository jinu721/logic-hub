import { UserIF } from "./user.types";

export interface GroupIF{
  _id?: string;
  name: string;
  description?: string;
  image?: string | null;
  createdBy: UserIF;
  admins: UserIF[];
  members: UserIF[];
  groupType:  string;
  memberCount: number;
  userRequests?: UserIF[];
  voiceRoom?: {
    topic?: string;
    scheduledFor?: Date;
    durationMinutes?: number;
    isActive: boolean;
    host: UserIF;
    participants: UserIF[];
    startAt: Date;
    endAt: Date;
    mutedUsers: UserIF[];
  };
  isDeleted:boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}