import { FilterQuery, SortOrder as MongoSortOrder } from "mongoose";

export type MongoQueryFilter<T> = FilterQuery<T>;

export type MongoSortOptions = Record<string, MongoSortOrder | 1 | -1>;

export interface MessageQueryFilter {
    conversationId?: string;
    sender?: string;
    type?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
    isDeleted?: boolean;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    [key: string]: unknown;
}

export interface ConversationSearchFilter {
    search?: string;
    type?: 'private' | 'group';
    [key: string]: unknown;
}

export interface MarketItemFilter {
    category?: 'avatar' | 'banner' | 'badge';
    available?: boolean;
    limitedTime?: boolean;
    isExclusive?: boolean;
    costXP?: { $lte?: number; $gte?: number } | number;
    sortBy?: 'costXP' | 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
    [key: string]: unknown;
}

export interface SubmissionFilter {
    userId?: string;
    challengeId?: string;
    passed?: boolean;
    status?: "completed" | "failed-timeout" | "failed-output" | "pending";
    level?: "novice" | "adept" | "master";
    submittedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    [key: string]: unknown;
}
