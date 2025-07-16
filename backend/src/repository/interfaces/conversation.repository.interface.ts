import { Types } from "mongoose";
import { ConversationIF } from "../../types/conversation.types";

export interface IConversationRepository {
    findOneToOne(userA: string, userB: string): Promise<ConversationIF | null>;
    findConversationById(conversationId: string): Promise<ConversationIF | null>;
    createOneToOne(userA: string, userB: string): Promise<ConversationIF | null>;
    setTypingUser(conversationId:string,userId:string):Promise<ConversationIF | null>;
    removeTypingUser(conversationId:string,userId:string):Promise<ConversationIF | null>;
    getTypingUsers(conversationId: string): Promise<any[]>;
    softDeleteByGroupId(groupId: string): Promise<ConversationIF | null>;
    createGroup(participants: string[], groupId: string): Promise<ConversationIF | null>;
    findConversationsByUser(userId: string): Promise<ConversationIF[] | null>;
    addParticipants(groupId: string, userIds: Types.ObjectId[]): Promise<ConversationIF | null>;
    removeParticipants(groupId: string, userIds: Types.ObjectId[]): Promise<ConversationIF | null>;
    addUnreadCountsForUsers(conversationId: string, userIds: string[]): Promise<ConversationIF | null>;
    markRead(conversationId: string, userId: string): Promise<ConversationIF | null>;
    findConversationByGroup(groupId: string): Promise<ConversationIF | null>;
  }
  