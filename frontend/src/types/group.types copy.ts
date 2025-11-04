
export interface GroupIF  {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdBy: string;
  admins: string[];
  members: string[];
  groupType: 'public-open' | 'public-approval';
  userRequests: string[];
  voiceRoom?: {
    topic?: string;
    scheduledFor?: Date;
    durationMinutes?: number;
    isActive: boolean;
    host: string;
    participants: string[];
    startAt: Date;
    endAt: Date;
    mutedUsers: string[];
  };
  isDeleted:boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface GroupDataIF {
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  groupImage?: File;
}

export interface UpdateGroupIF {
  groupId: string;
  name?: string;
  description?: string;
  banner?: string;
}

export interface MemberUpdateIF {
  userId: string;
  groupId: string;
  members: string[];
}

export interface AdminUpdateIF {
  groupId: string;
  userId: string;
}