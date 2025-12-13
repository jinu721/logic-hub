import { Types } from "mongoose";
import { SubmitChallengeResult } from "./challenge.types";


export interface CreateMessageInput {
    conversationId: string | Types.ObjectId;
    content?: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
    mentionedUsers?: string[] | Types.ObjectId[];
    media?: {
        url: string;
        type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
    };
    replyTo?: string | Types.ObjectId;
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
    avatar?: string;
    [key: string]: unknown;
}

export interface SubmissionEffectsData extends SubmitChallengeResult {
}

export interface SubmissionEffectsResult {
    passed: boolean;
    xpGained: number;
    newLevel?: number;
    [key: string]: unknown;
}
