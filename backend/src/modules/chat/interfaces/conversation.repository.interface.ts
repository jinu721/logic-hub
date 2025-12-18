import { Types } from "mongoose";
import { ConversationDocument, PopulatedConversation } from "@shared/types";

export interface IConversationRepository {
  findOneToOne(userA: string, userB: string): Promise<PopulatedConversation | null>;
  findConversationById(conversationId: string): Promise<PopulatedConversation | null>;
  createOneToOne(userA: string, userB: string): Promise<ConversationDocument | null>;
  setTypingUser(conversationId: string, userId: string): Promise<ConversationDocument | null>;
  removeTypingUser(conversationId: string, userId: string): Promise<ConversationDocument | null>;
  getTypingUsers(conversationId: string): Promise<ConversationDocument[]>;
  softDeleteByGroupId(groupId: string): Promise<ConversationDocument | null>;
  createGroup(participants: string[], groupId: string): Promise<ConversationDocument | null>;
  findConversationsByUser(userId: string): Promise<PopulatedConversation[] | null>;
  addParticipants(groupId: string, userIds: Types.ObjectId[]): Promise<ConversationDocument | null>;
  removeParticipants(groupId: string, userIds: Types.ObjectId[]): Promise<ConversationDocument | null>;
  addUnreadCountsForUsers(conversationId: string, userIds: string[]): Promise<ConversationDocument | null>;
  markRead(conversationId: string, userId: string): Promise<ConversationDocument | null>;
  findConversationByGroup(groupId: string): Promise<PopulatedConversation | null>;
  saveConversation(conversation: ConversationDocument): Promise<ConversationDocument | null>;
  updateLastMessage(conversationId: string, messageId: string): Promise<ConversationDocument | null>;
}
