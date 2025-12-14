import { Types } from "mongoose";
import { SubmitChallengeResult } from "./challenge.types";


export interface CreateMessageInput {
    sender: string | Types.ObjectId;    
    conversationId: string | Types.ObjectId;
    content?: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
    mentionedUsers?: string[] | Types.ObjectId[];
    media?: {
        url: string;
        type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
    };
    replyTo?: string | Types.ObjectId;
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
