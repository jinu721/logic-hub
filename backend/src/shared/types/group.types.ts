import { Document, Types } from 'mongoose';

export interface GroupAttrs {
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
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GroupDocument extends GroupAttrs, Document { }

export interface GroupAllInput {
    name?: string
    isActive?: boolean;
    members?: string
    createdBy?: string;
}


export interface CreateGroupInput {
    name: string;
    description?: string;
    image?: string;
    members?: string[];
    groupType?: string;
}

export interface UpdateGroupInput {
    name?: string;
    description?: string;
    isActive?: boolean;
    settings?: {
        allowMemberInvite?: boolean;
        allowMemberRemove?: boolean;
        allowNameChange?: boolean;
    };
}

export interface UpdateGroupInfoInput {
    name?: string;
    description?: string;
    members?: Types.ObjectId[] | string[];
    admins?: Types.ObjectId[] | string[];
    groupType?: string;
    userRequests?: Types.ObjectId[] | string[];
    [key: string]: unknown;
}


export interface GroupQueryFilter {
    name?: string;
    groupType?: string;
    search?: string;
    page?: string;
    limit?: string;
}